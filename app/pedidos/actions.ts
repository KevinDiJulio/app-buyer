"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function confirmarCompra() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  // Traemos solo los items que el usuario marcó con checkbox,
  // incluyendo los datos del producto (precio, nombre, stock)
  const items = await prisma.carritoItem.findMany({
    where: { userId, seleccionado: true },
    include: { producto: true },
  });

  if (items.length === 0) throw new Error("No hay items seleccionados en el carrito");

  // Calculamos el total sumando precio * cantidad de cada item seleccionado
  let total = 0;
  for (const item of items) {
    total += item.producto.precio * item.cantidad;
  }

  // Todo lo siguiente ocurre en una transacción atómica:
  // si cualquier paso falla, NADA se guarda en la DB (rollback automático)
  await prisma.$transaction(async (tx) => {

    // Paso 1: revalidar stock dentro de la transacción
    // (alguien pudo haber comprado los últimos items entre que abriste el carrito y confirmaste)
    for (const item of items) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${item.producto.nombre}" (disponible: ${producto?.stock ?? 0})`
        );
      }
    }

    // Paso 2: crear el Pedido con sus PedidoItems anidados en una sola query
    // precioUnitario guarda el precio al momento de compra (snapshot)
    // así el historial no cambia si el admin modifica el precio después
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

    // Paso 3: descontar el stock de cada producto comprado
    for (const item of items) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    // Paso 4: limpiar solo los items seleccionados del carrito
    // los items sin checkear se quedan para la próxima compra
    await tx.carritoItem.deleteMany({
      where: { userId, seleccionado: true },
    });
  });

  // Forzamos que Next.js regenere las páginas que muestran stock o carrito
  revalidatePath("/carrito");
  revalidatePath("/");

  // Redirigimos al historial de pedidos
  redirect("/pedidos");
}
