"use client";

import { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

// Chakra v3 lee el color mode desde el atributo data-theme en <html>
// No tiene useColorMode — lo manejamos manualmente con localStorage
const STORAGE_KEY = "chakra-ui-color-mode";

export default function BtnColorMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Al montar: leer la preferencia guardada o usar la del sistema operativo
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    setDark(!dark);
  }

  return (
    <Button size="sm" variant="ghost" onClick={toggle} aria-label="Alternar modo oscuro">
      {dark ? "☀️" : "🌙"}
    </Button>
  );
}
