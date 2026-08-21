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

  const producto = await prisma.producto.findUnique({ where: { id: productoId } });
  if (!producto) throw new Error("Producto no encontrado");

  const itemExistente = await prisma.carritoItem.findUnique({
    where: { userId_productoId: { userId, productoId } },
  });

  const cantidadTotal = (itemExistente?.cantidad ?? 0) + cantidad;
  if (cantidadTotal > producto.stock) {
    throw new Error(`Stock disponible: ${producto.stock} unidades`);
  }

  await prisma.carritoItem.upsert({
    where: { userId_productoId: { userId, productoId } },
    update: { cantidad: { increment: cantidad } },
    create: { userId, productoId, cantidad },
  });

  revalidatePath("/carrito");
}

export async function actualizarCantidad(id: number, cantidad: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  if (cantidad < 1) {
    await prisma.carritoItem.delete({ where: { id, userId } });
  } else {
    const item = await prisma.carritoItem.findUnique({
      where: { id, userId },
      include: { producto: true },
    });
    if (!item) throw new Error("Item no encontrado");
    if (cantidad > item.producto.stock) {
      throw new Error(`Stock disponible: ${item.producto.stock} unidades`);
    }
    await prisma.carritoItem.update({ where: { id, userId }, data: { cantidad } });
  }

  revalidatePath("/carrito");
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

  await prisma.carritoItem.delete({ where: { id, userId } });
  revalidatePath("/carrito");
}
