"use client";

import { useState } from "react";
import { Box, Flex, Text, Badge, Input } from "@chakra-ui/react";

type Item = {
  id: number;
  cantidad: number;
  precioUnitario: number;
  producto: { nombre: string; emoji: string };
};

type Pedido = {
  id: number;
  total: number;
  estado: string;
  creadoEn: Date;
  items: Item[];
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}
function fmtFecha(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

export default function ListaPedidos({ pedidos }: { pedidos: Pedido[] }) {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();

  // Filtra pedidos que tengan al menos un item cuyo producto coincide con la búsqueda
  const filtrados = q
    ? pedidos.filter((p) =>
        p.items.some((i) => i.producto.nombre.toLowerCase().includes(q))
      )
    : pedidos;

  return (
    <Box>
      {/* Buscador */}
      <Input
        placeholder="Buscar por producto..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        mb={5}
        maxW="360px"
      />

      {filtrados.length === 0 && (
        <Text color="gray.500" mt={4}>
          {q ? `No hay pedidos con "${query}"` : "No tenés pedidos todavía."}
        </Text>
      )}

      <Flex direction="column" gap={4}>
        {filtrados.map((pedido) => {
          // Items que coinciden con la búsqueda (para destacarlos), o todos si no hay búsqueda
          const itemsDestacados = q
            ? pedido.items.filter((i) => i.producto.nombre.toLowerCase().includes(q))
            : pedido.items;
          const itemsResto = q
            ? pedido.items.filter((i) => !i.producto.nombre.toLowerCase().includes(q))
            : [];

          return (
            <Box
              key={pedido.id}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              overflow="hidden"
              _dark={{ bg: "gray.900", borderColor: "gray.700" }}
            >
              {/* Cabecera */}
              <Flex
                px={5} py={4}
                justify="space-between" align="center"
                borderBottom="1px solid" borderColor="gray.100"
                _dark={{ borderColor: "gray.800" }}
              >
                <Flex align="center" gap={3}>
                  <Text fontWeight="semibold" fontSize="sm">Pedido #{pedido.id}</Text>
                  <Badge
                    colorPalette={pedido.estado === "pagado" ? "green" : "yellow"}
                    variant="subtle" borderRadius="full" px={3}
                  >
                    {pedido.estado}
                  </Badge>
                </Flex>
                <Text fontSize="xs" color="gray.400">{fmtFecha(pedido.creadoEn)}</Text>
              </Flex>

              {/* Items destacados (match con búsqueda) */}
              <Flex direction="column" px={5} py={3} gap={2}>
                {itemsDestacados.map((item) => (
                  <Flex key={item.id} justify="space-between" align="center" py={1}>
                    <Flex align="center" gap={3}>
                      <Text fontSize="xl">{item.producto.emoji}</Text>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">{item.producto.nombre}</Text>
                        <Text fontSize="xs" color="gray.400">
                          {fmt(item.precioUnitario)} × {item.cantidad}
                        </Text>
                      </Box>
                    </Flex>
                    <Text fontSize="sm" fontWeight="semibold">
                      {fmt(item.precioUnitario * item.cantidad)}
                    </Text>
                  </Flex>
                ))}

                {/* Items que no coinciden, más tenues */}
                {itemsResto.map((item) => (
                  <Flex key={item.id} justify="space-between" align="center" py={1} opacity={0.4}>
                    <Flex align="center" gap={3}>
                      <Text fontSize="xl">{item.producto.emoji}</Text>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">{item.producto.nombre}</Text>
                        <Text fontSize="xs" color="gray.400">
                          {fmt(item.precioUnitario)} × {item.cantidad}
                        </Text>
                      </Box>
                    </Flex>
                    <Text fontSize="sm" fontWeight="semibold">
                      {fmt(item.precioUnitario * item.cantidad)}
                    </Text>
                  </Flex>
                ))}
              </Flex>

              {/* Total */}
              <Flex
                px={5} py={3}
                justify="flex-end" align="center" gap={3}
                borderTop="1px solid" borderColor="gray.100"
                _dark={{ borderColor: "gray.800" }}
              >
                <Text fontSize="sm" color="gray.500">Total</Text>
                <Text fontSize="lg" fontWeight="bold" color="purple.600" _dark={{ color: "purple.300" }}>
                  {fmt(pedido.total)}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
