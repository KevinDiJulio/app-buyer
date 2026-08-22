"use client";

import { useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import { confirmarCompra } from "@/app/pedidos/actions";

// Client Component: necesita useState para manejar loading y errores
// Recibe el total como prop para saber si el botón debe estar deshabilitado
export default function BtnConfirmarCompra({ total }: { total: number }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmar() {
    setCargando(true);
    setError(null);
    try {
      // confirmarCompra es una Server Action: corre en el servidor,
      // valida stock, crea el pedido y redirige a /pedidos
      await confirmarCompra();
    } catch (e) {
      // Si la action tira un error (ej: stock insuficiente), lo mostramos
      // sin recargar la página ni perder el estado del carrito
      setError(e instanceof Error ? e.message : "Error al confirmar la compra");
      setCargando(false);
    }
  }

  return (
    <div style={{ textAlign: "right" }}>
      {/* Mostramos el error arriba del botón si lo hay */}
      {error && (
        <Text color="red.500" fontSize="sm" mb={2}>
          {error}
        </Text>
      )}
      <Button
        colorPalette="purple"
        size="lg"
        // Deshabilitado si no hay items seleccionados (total=0) o está cargando
        disabled={total === 0 || cargando}
        loading={cargando}
        onClick={handleConfirmar}
      >
        Confirmar compra
      </Button>
    </div>
  );
}
