"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Flex, HStack } from "@chakra-ui/react";

type Props = {
  paginaActual: number;
  totalPaginas: number;
};

export default function Paginacion({ paginaActual, totalPaginas }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPaginas <= 1) return null;

  function irA(pagina: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pagina));
    router.push(`/?${params.toString()}`);
  }

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <Flex alignItems="center" justifyContent="center" gap={2} mt={12} flexWrap="wrap">
      <Button
        size="sm"
        variant="outline"
        colorPalette="purple"
        disabled={paginaActual === 1}
        onClick={() => irA(paginaActual - 1)}
      >
        ← Anterior
      </Button>

      <HStack gap={1}>
        {paginas.map((n) => (
          <Button
            key={n}
            size="sm"
            variant={n === paginaActual ? "solid" : "outline"}
            colorPalette="purple"
            onClick={() => irA(n)}
          >
            {n}
          </Button>
        ))}
      </HStack>

      <Button
        size="sm"
        variant="outline"
        colorPalette="purple"
        disabled={paginaActual === totalPaginas}
        onClick={() => irA(paginaActual + 1)}
      >
        Siguiente →
      </Button>
    </Flex>
  );
}
