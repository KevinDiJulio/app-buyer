"use client";

import { useState } from "react";
import { Button, Text } from "@chakra-ui/react";
import { confirmarCompra } from "@/app/pedidos/actions";

// Client Component para manejar loading y errores en el cliente
export default function BtnConfirmarCompra({ total }: { total: number }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmar() {
    setCargando(true);
    setError(null);
    try {
      await confirmarCompra();
    } catch (e) {
      // redirect() de Next.js lanza un error interno con digest "NEXT_REDIRECT"
      // hay que re-lanzarlo para que Next.js lo procese como navegación
      if ((e as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw e;

      setError(e instanceof Error ? e.message : "Error al confirmar la compra");
      setCargando(false);
    }
  }

  return (
    <div style={{ textAlign: "right" }}>
      {error && (
        <Text color="red.500" fontSize="sm" mb={2}>
          {error}
        </Text>
      )}
      <Button
        colorPalette="purple"
        size="lg"
        disabled={total === 0 || cargando}
        loading={cargando}
        onClick={handleConfirmar}
      >
        Confirmar compra
      </Button>
    </div>
  );
}
