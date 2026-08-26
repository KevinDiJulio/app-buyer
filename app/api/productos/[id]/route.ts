import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const productoId = parseInt(id);

  if (isNaN(productoId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
  });

  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(producto);
}
