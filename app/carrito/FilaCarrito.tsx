"use client";

import { useState, useRef } from "react";
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
  const [cantidadLocal, setCantidadLocal] = useState(item.cantidad);
  const [seleccionadoLocal, setSeleccionadoLocal] = useState(item.seleccionado);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleSeleccion(checked: boolean) {
    setSeleccionadoLocal(checked);
    try {
      await actualizarSeleccion(item.id, checked);
    } catch {
      setSeleccionadoLocal(!checked); // revertir si falla
    }
  }

  const maxCantidad = item.producto.stock;

  function handleCantidad(nuevaCantidad: number) {
    const val = Math.min(Math.max(1, nuevaCantidad), maxCantidad);
    setCantidadLocal(val);
    setError(null);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setCargando(true);
      try {
        await actualizarCantidad(item.id, val);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error al actualizar");
        setCantidadLocal(item.cantidad); // revertir al valor original
      } finally {
        setCargando(false);
      }
    }, 500);
  }

  async function handleEliminar() {
    setCargando(true);
    setError(null);
    try {
      await eliminarDelCarrito(item.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar");
      setCargando(false);
    }
  }

  const subtotal = item.producto.precio * cantidadLocal;

  return (
    <>
    {error && (
      <tr>
        <td colSpan={6} style={{ padding: "4px 12px" }}>
          <Text color="red.500" fontSize="xs">{error}</Text>
        </td>
      </tr>
    )}
    <tr style={{ borderBottom: "1px solid var(--chakra-colors-gray-100)", opacity: cargando ? 0.5 : 1 }}>
      <td style={{ padding: "12px" }}>
        <input
          type="checkbox"
          checked={seleccionadoLocal}
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
          max={maxCantidad}
          value={String(cantidadLocal)}
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
    </>
  );
}
