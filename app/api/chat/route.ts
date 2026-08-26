import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type MensajeChat = { rol: "ai" | "user"; texto: string };

export async function POST(req: Request) {
  const { mensajes }: { mensajes: MensajeChat[] } = await req.json();

  const productos = await prisma.producto.findMany({
    select: { nombre: true, precio: true, stock: true, emoji: true },
    orderBy: { nombre: "asc" },
  });

  const catalogo = productos
    .map((p) => `${p.emoji} ${p.nombre} — $${p.precio.toLocaleString("es-AR")} (stock: ${p.stock})`)
    .join("\n");

  const systemPrompt = `Sos el asistente de compras de un marketplace argentino. Respondés preguntas sobre productos, precios y cómo comprar. Respondé siempre en español, de forma breve y amigable.

Catálogo actual:
${catalogo}

Si te preguntan por un producto que no está en el catálogo, decílo claramente. No inventes productos ni precios.`;

  // Convertir al formato de Gemini: "user" | "model"
  const historial = mensajes.map((m) => ({
    role: m.rol === "user" ? "user" : "model",
    parts: [{ text: m.texto }],
  }));

  // El último mensaje debe ser del user — lo separamos del historial
  const ultimoMensaje = historial.at(-1);
  const historialPrevio = historial.slice(0, -1);

  if (!ultimoMensaje || ultimoMensaje.role !== "user") {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
  }

  const chat = ai.chats.create({
    model: "gemini-3.6-flash",
    config: { systemInstruction: systemPrompt },
    history: historialPrevio,
  });

  const response = await chat.sendMessage({ message: ultimoMensaje.parts[0].text });

  return NextResponse.json({ respuesta: response.text });
}
