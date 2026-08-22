"use client";

import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

// Chakra v3 activa dark mode con la clase ".dark" en <html>, no con data-theme
const STORAGE_KEY = "chakra-ui-color-mode";

export default function BtnColorMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Al montar: leer la preferencia guardada o usar la del sistema operativo
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }

  return (
    <Button size="sm" variant="ghost" onClick={toggle} aria-label="Alternar modo oscuro">
      {dark ? "☀️" : "🌙"}
    </Button>
  );
}
