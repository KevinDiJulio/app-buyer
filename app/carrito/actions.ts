"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function agregarAlCarrito(productoId: number, cantidad: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Debés iniciar sesión para agregar al carrito");

  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error("La cantidad debe ser al menos 1");
  }

  await prisma.$transaction(async (tx) => {
    const producto = await tx.producto.findUnique({ where: { id: productoId } });
    if (!producto) throw new Error("Producto no encontrado");
    if (cantidad > producto.stock) {
      throw new Error(`Stock disponible: ${producto.stock} unidades`);
    }

    await tx.carritoItem.upsert({
      where: { userId_productoId: { userId, productoId } },
      update: { cantidad: { increment: cantidad } },
      create: { userId, productoId, cantidad },
    });

    await tx.producto.update({
      where: { id: productoId },
      data: { stock: { decrement: cantidad } },
    });
  });

  revalidatePath("/carrito");
  revalidatePath("/");
}

export async function actualizarCantidad(id: number, cantidad: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  await prisma.$transaction(async (tx) => {
    const item = await tx.carritoItem.findUnique({ where: { id, userId } });
    if (!item) throw new Error("Item no encontrado");

    const diff = cantidad - item.cantidad;

    if (cantidad < 1) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { increment: item.cantidad } },
      });
      await tx.carritoItem.delete({ where: { id, userId } });
    } else if (diff > 0) {
      const producto = await tx.producto.findUnique({ where: { id: item.productoId } });
      if (!producto || producto.stock < diff) {
        throw new Error(`Stock disponible: ${producto?.stock ?? 0} unidades adicionales`);
      }
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { decrement: diff } },
      });
      await tx.carritoItem.update({ where: { id, userId }, data: { cantidad } });
    } else if (diff < 0) {
      await tx.producto.update({
        where: { id: item.productoId },
        data: { stock: { increment: -diff } },
      });
      await tx.carritoItem.update({ where: { id, userId }, data: { cantidad } });
    }
  });

  revalidatePath("/carrito");
  revalidatePath("/");
}

export async function actualizarSeleccion(id: number, seleccionado: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  await prisma.carritoItem.update({ where: { id, userId }, data: { seleccionado } });
  revalidatePath("/carrito");
}

export async function eliminarDelCarrito(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  await prisma.$transaction(async (tx) => {
    const item = await tx.carritoItem.findUnique({ where: { id, userId } });
    if (!item) throw new Error("Item no encontrado");

    await tx.producto.update({
      where: { id: item.productoId },
      data: { stock: { increment: item.cantidad } },
    });
    await tx.carritoItem.delete({ where: { id, userId } });
  });

  revalidatePath("/carrito");
  revalidatePath("/");
}
