import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import Header from "./components/Header";
import ChatWidget from "./components/ChatWidget";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Práctica Final 3 — IAW 2026",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const productos = await prisma.producto.findMany({
    select: { id: true, nombre: true, precio: true, stock: true, emoji: true },
    orderBy: { id: "asc" },
  });

  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body>
          <Providers>
            <Header />
            <main>{children}</main>
            <ChatWidget productos={productos} />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
