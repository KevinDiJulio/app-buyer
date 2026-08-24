import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function autenticado(req: Request): boolean {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  return token === process.env.API_SECRET_KEY;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!autenticado(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const pedidoId = parseInt(id);

  if (isNaN(pedidoId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const pedido = await prisma.pedido.findUnique({
    where: { id: pedidoId },
    include: {
      items: {
        include: { producto: { select: { nombre: true, emoji: true } } },
      },
    },
  });

  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json(pedido);
}
