"use client";

import { useState } from "react";
import { Button, Text, Box } from "@chakra-ui/react";
import Link from "next/link";
import { confirmarCompra } from "@/app/pedidos/actions";

export default function BtnConfirmarCompra({ total }: { total: number }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [esperandoVuelta, setEsperandoVuelta] = useState(false);

  async function handleConfirmar() {
    setCargando(true);
    setError(null);
    try {
      const { checkoutUrl } = await confirmarCompra();
      setEsperandoVuelta(true);
      window.location.href = checkoutUrl;
    } catch (e) {
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
        mb={3}
      >
        {cargando ? "Redirigiendo a MercadoPago..." : "Pagar con MercadoPago"}
      </Button>
      <Box>
        <Link href="/pago/verificar">
          <Text fontSize="sm" color="gray.400" _hover={{ color: "purple.500" }}>
            ¿Ya pagaste? Verificar mi pago →
          </Text>
        </Link>
      </Box>
    </div>
  );
}
