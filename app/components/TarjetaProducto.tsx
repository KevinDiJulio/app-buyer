"use client";
import { Box, Text, Button, Badge, Heading } from "@chakra-ui/react";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  emoji: string;
  stock: number;
};

const GRADIENTES = [
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #3B82F6, #0891B2)",
  "linear-gradient(135deg, #10B981, #0D9488)",
  "linear-gradient(135deg, #F97316, #D97706)",
  "linear-gradient(135deg, #EC4899, #E11D48)",
  "linear-gradient(135deg, #6366F1, #3B82F6)",
];

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const gradiente = GRADIENTES[producto.id % GRADIENTES.length];
  const sinStock = producto.stock === 0;

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      boxShadow="sm"
      transition="transform 0.2s, box-shadow 0.2s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      _dark={{ borderColor: "gray.700" }}
    >
      <Box
        h="120px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ background: gradiente }}
      >
        <Text fontSize="4xl">{producto.emoji}</Text>
      </Box>

      <Box p={4} display="flex" flexDirection="column" gap={2} flex={1} bg="white" _dark={{ bg: "gray.800" }}>
        <Heading size="sm" color="gray.800" _dark={{ color: "white" }}>
          {producto.nombre}
        </Heading>
        <Text fontSize="sm" color="gray.500" flex={1}>
          {producto.descripcion}
        </Text>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Text fontWeight="bold" fontSize="xl" color="gray.900" _dark={{ color: "white" }}>
            ${producto.precio.toFixed(2)}
          </Text>
          <Badge colorPalette={sinStock ? "red" : "green"} borderRadius="full" px={2}>
            {sinStock ? "Sin stock" : `${producto.stock} uds.`}
          </Badge>
        </Box>

        <Button
          colorPalette="purple"
          size="sm"
          width="full"
          mt={1}
          disabled={sinStock}
        >
          {sinStock ? "Sin stock" : "Comprar"}
        </Button>
      </Box>
    </Box>
  );
}
