import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Box, Text, Button } from "@chakra-ui/react";
import { prisma } from "@/lib/prisma";
import ListaPedidos from "./ListaPedidos";

export default async function PedidosPage() {
  const { userId } = await auth();

  // Si no está logueado, redirigir al inicio
  if (!userId) redirect("/");

  const pedidos = await prisma.pedido.findMany({
    where: { userId },
    include: {
      items: {
        include: { producto: true },
      },
    },
    orderBy: { creadoEn: "desc" }, // más reciente primero
  });

  // ── Sin pedidos ──────────────────────────────────────────────────────────
  if (pedidos.length === 0) {
    return (
      <Box maxW="600px" mx="auto" mt="80px" textAlign="center" px={4}>
        <Text fontSize="4xl" mb={4}>🛍️</Text>
        <Text fontSize="xl" fontWeight="semibold" mb={2}>Todavía no hiciste ningún pedido</Text>
        <Text color="gray.500" mb={6}>Explorá el catálogo y agregá productos al carrito.</Text>
        <Link href="/">
          <Button colorPalette="purple">Ver productos</Button>
        </Link>
      </Box>
    );
  }

  // ── Lista de pedidos ─────────────────────────────────────────────────────
  return (
    <Box maxW="720px" mx="auto" py={8} px={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={6} letterSpacing="-0.02em">
        Mis pedidos
      </Text>
      <ListaPedidos pedidos={pedidos} />
    </Box>
  );
}
