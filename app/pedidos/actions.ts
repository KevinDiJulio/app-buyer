"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function confirmarCompra() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  // Solo los items marcados con checkbox
  const items = await prisma.carritoItem.findMany({
    where: { userId, seleccionado: true },
    include: { producto: true },
  });

  if (items.length === 0) throw new Error("No hay items seleccionados en el carrito");

  // Subtotal de cada item sumado
  let total = 0;
  for (const item of items) {
    total += item.producto.precio * item.cantidad;
  }

  // Transacción atómica: si cualquier paso falla, nada se guarda
  await prisma.$transaction(async (tx) => {

    // Revalidar stock dentro de la transacción para evitar race conditions:
    // otro usuario pudo haber comprado los últimos items entre que se abrió
    // el carrito y se confirmó la compra
    for (const item of items) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${item.producto.nombre}" (disponible: ${producto?.stock ?? 0})`
        );
      }
    }

    // Crear el pedido con sus items anidados en una sola query
    // precioUnitario es un snapshot del precio actual: si el admin lo cambia
    // después, el historial del pedido queda intacto
    await tx.pedido.create({
      data: {
        userId,
        total,
        estado: "pagado",
        items: {
          create: items.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precio,
          })),
        },
      },
    });

    // Descontar stock de cada producto comprado
    for (const item of items) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    // Limpiar solo los items seleccionados; los sin checkear quedan en el carrito
    await tx.carritoItem.deleteMany({
      where: { userId, seleccionado: true },
    });
  });

  revalidatePath("/carrito");
  revalidatePath("/");
  redirect("/pedidos");
}
