import { prisma } from "@/lib/prisma";
import { Box, Heading, Text } from "@chakra-ui/react";
import FilaPedido from "./FilaPedido";

export default async function AdminPedidosPage() {
  const pedidos = await prisma.pedido.findMany({
    include: {
      items: {
        include: { producto: { select: { nombre: true, emoji: true } } },
      },
    },
    orderBy: { creadoEn: "desc" },
  });

  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <Heading size="xl" mb={8}>Gestión de pedidos</Heading>

      {pedidos.length === 0 ? (
        <Text color="gray.500">Todavía no hay pedidos.</Text>
      ) : (
        <Box overflowX="auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--chakra-colors-gray-200)", textAlign: "left" }}>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>#</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Usuario</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Ítems</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Total</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Estado</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Fecha</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <FilaPedido key={pedido.id} pedido={pedido} />
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
}
