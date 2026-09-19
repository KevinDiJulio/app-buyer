import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Container, Heading, Text, Button } from "@chakra-ui/react";
import { buscarUltimoPagoAprobado, crearPedidoDesdePago } from "@/app/pedidos/actions";

export default async function VerificarPagoPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const paymentId = await buscarUltimoPagoAprobado(userId);

  if (!paymentId) {
    return (
      <Container maxW="container.sm" py={24} textAlign="center">
        <Text fontSize="5xl" mb={4}>🔍</Text>
        <Heading size="lg" mb={3}>No encontramos un pago aprobado</Heading>
        <Text color="gray.500" mb={8}>
          Si acabás de pagar, esperá unos segundos y recargá la página.
        </Text>
        <Link href="/carrito">
          <Button colorPalette="purple">Volver al carrito</Button>
        </Link>
      </Container>
    );
  }

  try {
    const pedido = await crearPedidoDesdePago(paymentId);

    return (
      <Container maxW="container.sm" py={24} textAlign="center">
        <Text fontSize="5xl" mb={4}>✅</Text>
        <Heading size="xl" mb={3}>¡Pago confirmado!</Heading>
        <Text color="gray.500" mb={2}>
          Tu pedido <strong>#{pedido.id}</strong> fue creado.
        </Text>
        <Text color="gray.500" mb={8}>
          Total: <strong>${pedido.total.toLocaleString("es-AR")}</strong>
        </Text>
        <Link href="/pedidos">
          <Button colorPalette="purple">Ver mis pedidos</Button>
        </Link>
      </Container>
    );
  } catch (e) {
    return (
      <Container maxW="container.sm" py={24} textAlign="center">
        <Text fontSize="5xl" mb={4}>❌</Text>
        <Heading size="lg" mb={3}>Error al procesar el pedido</Heading>
        <Text color="red.500" mb={8}>
          {e instanceof Error ? e.message : "Error inesperado"}
        </Text>
        <Link href="/carrito">
          <Button colorPalette="purple">Volver al carrito</Button>
        </Link>
      </Container>
    );
  }
}
