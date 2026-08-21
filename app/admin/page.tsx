import { prisma } from "@/lib/prisma";
import { Box, Heading, Text } from "@chakra-ui/react";
import FormularioProducto from "./FormularioProducto";
import FilaProducto from "./FilaProducto";

export default async function AdminPage() {
  const productos = await prisma.producto.findMany({ orderBy: { nombre: "asc" } });

  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={10}>
      <Heading size="xl" mb={8}>Administración de productos</Heading>

      <Box mb={10}>
        <Text fontWeight="semibold" mb={3} color="gray.600">Agregar producto</Text>
        <FormularioProducto />
      </Box>

      <Box>
        <Text fontWeight="semibold" mb={3} color="gray.600">
          Productos ({productos.length})
        </Text>
        <Box overflowX="auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--chakra-colors-gray-200)", textAlign: "left" }}>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Emoji</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Nombre</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Descripción</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Precio</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Stock</th>
                <th style={{ padding: "8px 16px", fontWeight: 600, fontSize: "13px", color: "var(--chakra-colors-gray-500)" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <FilaProducto key={producto.id} producto={producto} />
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}
