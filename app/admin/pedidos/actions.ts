"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const ESTADOS_VALIDOS = ["pendiente", "pagado", "en_preparacion", "despachado", "entregado", "cancelado"];

async function requireAdmin() {
  const { sessionClaims } = await auth();
  if ((sessionClaims?.metadata as { role?: string })?.role !== "admin") {
    throw new Error("No autorizado");
  }
}

export async function actualizarEstadoPedido(pedidoId: number, nuevoEstado: string) {
  await requireAdmin();

  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) {
    throw new Error("Estado inválido");
  }

  await prisma.pedido.update({
    where: { id: pedidoId },
    data: { estado: nuevoEstado },
  });

  revalidatePath("/admin/pedidos");
}
