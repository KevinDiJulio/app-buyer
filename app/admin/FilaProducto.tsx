"use client";

import { useState } from "react";
import { Box, Button, Input, HStack, Text } from "@chakra-ui/react";
import { borrarProducto, editarProducto } from "./actions";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  emoji: string;
  stock: number;
};

export default function FilaProducto({ producto }: { producto: Producto }) {
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleEditar(formData: FormData) {
    setError(null);
    setCargando(true);
    try {
      await editarProducto(producto.id, formData);
      setEditando(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al editar");
    } finally {
      setCargando(false);
    }
  }

  async function handleBorrar() {
    setError(null);
    setCargando(true);
    try {
      await borrarProducto(producto.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al borrar");
    } finally {
      setCargando(false);
    }
  }

  if (editando) {
    return (
      <tr>
        <td colSpan={6} style={{ padding: "8px" }}>
          <Box as="form" action={handleEditar}>
            <HStack gap={2} flexWrap="wrap">
              <Input name="emoji" defaultValue={producto.emoji} maxW="80px" size="sm" />
              <Input name="nombre" defaultValue={producto.nombre} flex={1} minW="140px" size="sm" />
              <Input name="descripcion" defaultValue={producto.descripcion} flex={2} minW="180px" size="sm" />
              <Input name="precio" type="number" step="0.01" defaultValue={producto.precio} maxW="110px" size="sm" />
              <Input name="stock" type="number" defaultValue={producto.stock} maxW="90px" size="sm" />
              <Button type="submit" size="sm" colorPalette="green" loading={cargando}>
                Guardar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditando(false)} disabled={cargando}>
                Cancelar
              </Button>
            </HStack>
            {error && <Text color="red.500" fontSize="sm" mt={1}>{error}</Text>}
          </Box>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td style={{ padding: "12px 16px" }}>{producto.emoji}</td>
      <td style={{ padding: "12px 16px" }}>{producto.nombre}</td>
      <td style={{ padding: "12px 16px", color: "var(--chakra-colors-gray-500)", fontSize: "14px" }}>{producto.descripcion}</td>
      <td style={{ padding: "12px 16px", fontWeight: 600 }}>${producto.precio.toFixed(2)}</td>
      <td style={{ padding: "12px 16px" }}>{producto.stock}</td>
      <td style={{ padding: "12px 16px" }}>
        <HStack gap={2}>
          <Button size="xs" colorPalette="blue" variant="outline" onClick={() => setEditando(true)}>
            Editar
          </Button>
          <Button size="xs" colorPalette="red" variant="outline" onClick={handleBorrar} loading={cargando}>
            Borrar
          </Button>
        </HStack>
        {error && <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>}
      </td>
    </tr>
  );
}
