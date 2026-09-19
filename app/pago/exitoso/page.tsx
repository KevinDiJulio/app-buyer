import Link from "next/link";
import { Container, Heading, Text, Button } from "@chakra-ui/react";
import { crearPedidoDesdePago } from "@/app/pedidos/actions";

export default async function PagoExitosoPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; status?: string }>;
}) {
  const { payment_id, status } = await searchParams;

  if (!payment_id || status !== "approved") {
    return (
      <Container maxW="container.sm" py={24} textAlign="center">
        <Text fontSize="5xl" mb={4}>⚠️</Text>
        <Heading size="lg" mb={3}>Pago no confirmado</Heading>
        <Text color="gray.500" mb={8}>No recibimos confirmación del pago.</Text>
        <Link href="/carrito">
          <Button colorPalette="purple">Volver al carrito</Button>
        </Link>
      </Container>
    );
  }

  try {
    const pedido = await crearPedidoDesdePago(payment_id);

    return (
      <Container maxW="container.sm" py={24} textAlign="center">
        <Text fontSize="5xl" mb={4}>✅</Text>
        <Heading size="xl" mb={3}>¡Pago exitoso!</Heading>
        <Text color="gray.500" mb={2}>
          Tu pedido <strong>#{pedido.id}</strong> fue confirmado.
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
