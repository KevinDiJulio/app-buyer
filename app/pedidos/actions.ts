"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mpPreference, mpPayment } from "@/lib/mercadopago";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function confirmarCompra(): Promise<{ checkoutUrl: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const items = await prisma.carritoItem.findMany({
    where: { userId, seleccionado: true },
    include: { producto: true },
  });

  if (items.length === 0) throw new Error("No hay items seleccionados en el carrito");

  // Verificar stock antes de crear la preferencia
  for (const item of items) {
    if (item.producto.stock < item.cantidad) {
      throw new Error(
        `Stock insuficiente para "${item.producto.nombre}" (disponible: ${item.producto.stock})`
      );
    }
  }

  const preference = await mpPreference.create({
    body: {
      items: items.map((item) => ({
        id: String(item.productoId),
        title: `${item.producto.emoji} ${item.producto.nombre}`,
        quantity: item.cantidad,
        unit_price: item.producto.precio,
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${BASE_URL}/pago/verificar`,
        failure: `${BASE_URL}/pago/fallido`,
        pending: `${BASE_URL}/pago/pendiente`,
      },
      external_reference: userId,
    },
  });

  if (!preference.init_point) throw new Error("No se pudo crear la preferencia de pago");

  return { checkoutUrl: preference.init_point };
}

export async function buscarUltimoPagoAprobado(userId: string): Promise<string | null> {
  const res = await fetch(
    `https://api.mercadopago.com/v1/payments/search?external_reference=${userId}&sort=date_created&criteria=desc&limit=5`,
    { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` }, cache: "no-store" }
  );
  const data = await res.json();
  const pago = (data.results ?? []).find((p: { status: string }) => p.status === "approved");
  return pago ? String(pago.id) : null;
}

export async function crearPedidoDesdePago(paymentId: string) {
  // Verificar con MP que el pago realmente fue aprobado
  const pagoInfo = await mpPayment.get({ id: Number(paymentId) });

  if (pagoInfo.status !== "approved") {
    throw new Error(`El pago no fue aprobado (estado: ${pagoInfo.status})`);
  }

  const userId = pagoInfo.external_reference;
  if (!userId) throw new Error("Referencia de pago inválida");

  // Idempotencia: si ya existe un pedido con este pagoId, no crear otro
  const pedidoExistente = await prisma.pedido.findFirst({ where: { pagoId: paymentId } });
  if (pedidoExistente) return pedidoExistente;

  const items = await prisma.carritoItem.findMany({
    where: { userId, seleccionado: true },
    include: { producto: true },
  });

  if (items.length === 0) throw new Error("No se encontraron items para este pago");

  let total = 0;
  for (const item of items) {
    total += item.producto.precio * item.cantidad;
  }

  const pedido = await prisma.$transaction(async (tx) => {
    // Revalidar stock
    for (const item of items) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para "${item.producto.nombre}"`);
      }
    }

    const nuevoPedido = await tx.pedido.create({
      data: {
        userId,
        total,
        estado: "pagado",
        pagoId: paymentId,
        items: {
          create: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
          })),
        },
      },
    });

    for (const item of items) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    await tx.carritoItem.deleteMany({ where: { userId, seleccionado: true } });

    return nuevoPedido;
  });

  revalidatePath("/carrito");
  revalidatePath("/pedidos");
  revalidatePath("/");

  return pedido;
}
