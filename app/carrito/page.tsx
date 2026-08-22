import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Box, Container, Heading, Text } from "@chakra-ui/react";
import FilaCarrito from "./FilaCarrito";
import BtnConfirmarCompra from "./BtnConfirmarCompra";

export default async function CarritoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const items = await prisma.carritoItem.findMany({
    where: { userId },
    include: { producto: true },
    orderBy: { id: "asc" },
  });

  const total = items
    .filter((item) => item.seleccionado)
    .reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

  return (
    <Container maxW="900px" px={{ base: 4, md: 8 }} py={10}>
      <Heading size="xl" mb={8}>Mi carrito</Heading>

      {items.length === 0 ? (
        <Text color="gray.500">Tu carrito está vacío.</Text>
      ) : (
        <>
          <Box overflowX="auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--chakra-colors-gray-200)", textAlign: "left" }}>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}></th>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}>Producto</th>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}>Precio unit.</th>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}>Cantidad</th>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}>Subtotal</th>
                  <th style={{ padding: "8px 12px", fontSize: "13px", color: "var(--chakra-colors-gray-500)", fontWeight: 600 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <FilaCarrito key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </Box>

          <Box mt={8} display="flex" justifyContent="flex-end" alignItems="center" gap={6}>
            <Box textAlign="right">
              <Text fontSize="sm" color="gray.500">Total seleccionado</Text>
              <Text fontWeight="bold" fontSize="2xl">${total.toFixed(2)}</Text>
            </Box>
            <BtnConfirmarCompra total={total} />
          </Box>
        </>
      )}
    </Container>
  );
}
