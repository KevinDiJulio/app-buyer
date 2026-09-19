"use client";

import { useRef, useState } from "react";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { crearProducto } from "./actions";

export default function FormularioProducto() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setCargando(true);
    try {
      await crearProducto(formData);
      formRef.current?.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al crear el producto");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit}>
      <Stack gap={3}>
        <Stack direction="row" gap={3} flexWrap="wrap">
          <Input name="emoji" placeholder="Emoji" required maxW="100px" />
          <Input name="nombre" placeholder="Nombre" required flex={1} minW="160px" />
          <Input name="descripcion" placeholder="Descripción" required flex={2} minW="200px" />
          <Input name="precio" type="number" step="0.01" placeholder="Precio" required maxW="120px" />
          <Input name="stock" type="number" placeholder="Stock" required maxW="100px" />
          <Button type="submit" colorPalette="purple" loading={cargando}>
            Agregar
          </Button>
        </Stack>

        {error && (
          <Text color="red.500" fontSize="sm">{error}</Text>
        )}
      </Stack>
    </form>
  );
}
