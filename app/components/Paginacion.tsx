"use client";
import { useRouter, useSearchParams } from "next/navigation";

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
    <div className="paginacion">
      <button
        className="pag-btn"
        disabled={paginaActual === 1}
        onClick={() => irA(paginaActual - 1)}
      >
        ← Anterior
      </button>

      <div className="pag-numeros">
        {paginas.map((n) => (
          <button
            key={n}
            className={`pag-numero ${n === paginaActual ? "pag-activo" : ""}`}
            onClick={() => irA(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        className="pag-btn"
        disabled={paginaActual === totalPaginas}
        onClick={() => irA(paginaActual + 1)}
      >
        Siguiente →
      </button>
    </div>
  );
}
