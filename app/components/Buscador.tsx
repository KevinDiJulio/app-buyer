"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
    <div className="buscador-wrap">
      <span className="buscador-icono">🔍</span>
      <input
        className="buscador-input"
        type="text"
        placeholder="Buscar productos..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      {valor && (
        <button className="buscador-clear" onClick={() => setValor("")}>✕</button>
      )}
    </div>
  );
}
