"use client";

import { useColorMode, Button } from "@chakra-ui/react";

// Botón que alterna entre modo claro y oscuro
// Necesita ser Client Component porque usa un hook de Chakra
export default function BtnColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button size="sm" variant="ghost" onClick={toggleColorMode} aria-label="Alternar modo oscuro">
      {colorMode === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
