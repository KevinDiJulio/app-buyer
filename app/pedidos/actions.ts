"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function confirmarCompra() {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const items = await prisma.carritoItem.findMany({
    where: { userId, seleccionado: true },
    include: { producto: true },
  });

  if (items.length === 0) throw new Error("No hay items seleccionados en el carrito");

  const total = items.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para "${item.producto.nombre}" (disponible: ${producto?.stock ?? 0})`
        );
      }
    }

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

    for (const item of items) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: item.cantidad } },
      });
    }

    await tx.carritoItem.deleteMany({
      where: { userId, seleccionado: true },
    });
  });

  revalidatePath("/carrito");
  revalidatePath("/");
  redirect("/pedidos");
}
