import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Box, Container, SimpleGrid, Heading, Text } from "@chakra-ui/react";
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
    <Container maxW="1280px" px={{ base: 4, md: 8 }} py={{ base: 6, md: 12 }}>
      <Box mb={10}>
        <Heading size="2xl" fontWeight="extrabold" letterSpacing="tight" mb={2}>
          Encontrá lo que necesitás
        </Heading>
        <Text color="gray.500" fontSize="lg">
          {total} producto{total !== 1 ? "s" : ""} disponibles
          {filtro && ` para "${filtro}"`}
        </Text>
      </Box>

      <Suspense>
        <Buscador />
      </Suspense>

      {productos.length === 0 ? (
        <Box textAlign="center" py={16} color="gray.500">
          <Text fontSize="lg">
            No se encontraron productos{filtro ? ` para "${filtro}"` : ""}.
          </Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
          {productos.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </SimpleGrid>
      )}

      <Suspense>
        <Paginacion paginaActual={pagina} totalPaginas={totalPaginas} />
      </Suspense>
    </Container>
  );
}
