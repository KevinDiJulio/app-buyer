"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Box, Input } from "@chakra-ui/react";

export default function Buscador() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(searchParams.get("q") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const qActual = searchParams.get("q") ?? "";
    if (valor === qActual) return;

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (valor) {
        params.set("q", valor);
      } else {
        params.delete("q");
      }
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    }, 350);

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [valor]);

  return (
    <Box position="relative" display="flex" alignItems="center" mb={8} maxW="480px">
      <Box
        position="absolute"
        left="14px"
        zIndex={1}
        pointerEvents="none"
        fontSize="sm"
      >
        🔍
      </Box>
      <Input
        pl="42px"
        pr={valor ? "40px" : "14px"}
        py={3}
        placeholder="Buscar productos..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        borderRadius="xl"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.600" }}
        _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 3px rgba(99,102,241,0.15)" }}
      />
      {valor && (
        <Box
          as="button"
          position="absolute"
          right="12px"
          onClick={() => setValor("")}
          color="gray.400"
          _hover={{ color: "gray.600" }}
          cursor="pointer"
          fontSize="sm"
        >
          ✕
        </Box>
      )}
    </Box>
  );
}
