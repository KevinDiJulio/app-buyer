"use client";

import { useState } from "react";
import { Box, Button, Text, NumberInput, HStack } from "@chakra-ui/react";
import { actualizarCantidad, actualizarSeleccion, eliminarDelCarrito } from "./actions";

type Item = {
  id: number;
  cantidad: number;
  seleccionado: boolean;
  producto: {
    id: number;
    nombre: string;
    emoji: string;
    precio: number;
    stock: number;
  };
};

export default function FilaCarrito({ item }: { item: Item }) {
  const [cargando, setCargando] = useState(false);

  async function handleSeleccion(checked: boolean) {
    setCargando(true);
    await actualizarSeleccion(item.id, checked);
    setCargando(false);
  }

  async function handleCantidad(nuevaCantidad: number) {
    const val = Math.min(Math.max(1, nuevaCantidad), item.producto.stock);
    setCargando(true);
    await actualizarCantidad(item.id, val);
    setCargando(false);
  }

  async function handleEliminar() {
    setCargando(true);
    await eliminarDelCarrito(item.id);
    setCargando(false);
  }

  const subtotal = item.producto.precio * item.cantidad;

  return (
    <tr style={{ borderBottom: "1px solid var(--chakra-colors-gray-100)", opacity: cargando ? 0.5 : 1 }}>
      <td style={{ padding: "12px" }}>
        <input
          type="checkbox"
          checked={item.seleccionado}
          onChange={(e) => handleSeleccion(e.target.checked)}
          style={{ width: "16px", height: "16px", cursor: "pointer" }}
        />
      </td>
      <td style={{ padding: "12px" }}>
        <HStack gap={2}>
          <Text fontSize="xl">{item.producto.emoji}</Text>
          <Text fontWeight="medium">{item.producto.nombre}</Text>
        </HStack>
      </td>
      <td style={{ padding: "12px" }}>
        <Text color="gray.600">${item.producto.precio.toFixed(2)}</Text>
      </td>
      <td style={{ padding: "12px" }}>
        <NumberInput.Root
          min={1}
          max={item.producto.stock}
          value={String(item.cantidad)}
          onValueChange={(e) => handleCantidad(Number(e.value))}
          size="sm"
          maxW="100px"
        >
          <NumberInput.Input />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>
      </td>
      <td style={{ padding: "12px" }}>
        <Text fontWeight="bold">${subtotal.toFixed(2)}</Text>
      </td>
      <td style={{ padding: "12px" }}>
        <Button size="xs" colorPalette="red" variant="outline" onClick={handleEliminar} disabled={cargando}>
          Quitar
        </Button>
      </td>
    </tr>
  );
}
