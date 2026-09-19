"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const { sessionClaims } = await auth();
  if ((sessionClaims?.metadata as { role?: string })?.role !== "admin") {
    throw new Error("No autorizado");
  }
}

const ProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0"),
  emoji: z.string().min(1, "El emoji es obligatorio"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
});

export async function crearProducto(formData: FormData) {
  await requireAdmin();
  const resultado = ProductoSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    emoji: formData.get("emoji"),
    stock: formData.get("stock"),
  });

  if (!resultado.success) {
    throw new Error(resultado.error.issues[0].message);
  }

  await prisma.producto.create({ data: resultado.data });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function editarProducto(id: number, formData: FormData) {
  await requireAdmin();
  const resultado = ProductoSchema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    emoji: formData.get("emoji"),
    stock: formData.get("stock"),
  });

  if (!resultado.success) {
    throw new Error(resultado.error.issues[0].message);
  }

  await prisma.producto.update({ where: { id }, data: resultado.data });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function borrarProducto(id: number) {
  await requireAdmin();
  const activos = await prisma.pedido.count({
    where: { items: { some: { productoId: id } }, estado: { not: "cancelado" } },
  });

  if (activos > 0) {
    throw new Error(
      `No se puede borrar: hay ${activos} pedido${activos > 1 ? "s" : ""} activo${activos > 1 ? "s" : ""}.`
    );
  }

  await prisma.producto.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
}
