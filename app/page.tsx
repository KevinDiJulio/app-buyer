import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import TarjetaProducto from "./components/TarjetaProducto";
import Buscador from "./components/Buscador";
import Paginacion from "./components/Paginacion";

const POR_PAGINA = 20;

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;
  const pagina = Math.max(1, parseInt(page) || 1);
  const filtro = q.trim();

  const where = filtro
    ? { nombre: { contains: filtro, mode: "insensitive" as const } }
    : {};

  const [productos, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip: (pagina - 1) * POR_PAGINA,
      take: POR_PAGINA,
    }),
    prisma.producto.count({ where }),
  ]);

  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="catalogo-page">
      <div className="catalogo-hero">
        <h1 className="catalogo-titulo">Encontrá lo que necesitás</h1>
        <p className="catalogo-subtitulo">
          {total} producto{total !== 1 ? "s" : ""} disponibles
          {filtro && ` para "${filtro}"`}
        </p>
      </div>

      <Suspense>
        <Buscador />
      </Suspense>

      {productos.length === 0 ? (
        <div className="catalogo-vacio">
          <p>No se encontraron productos{filtro ? ` para "${filtro}"` : ""}.</p>
        </div>
      ) : (
        <div className="catalogo-grid">
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      <Suspense>
        <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} />
      </Suspense>
    </div>
  );
}
