import Link from "next/link";
import { Container, Heading, Text, Button } from "@chakra-ui/react";

export default function PagoFallidoPage() {
  return (
    <Container maxW="container.sm" py={24} textAlign="center">
      <Text fontSize="5xl" mb={4}>❌</Text>
      <Heading size="xl" mb={3}>Pago rechazado</Heading>
      <Text color="gray.500" mb={8}>
        No pudimos procesar tu pago. Podés intentarlo de nuevo.
      </Text>
      <Link href="/carrito">
        <Button colorPalette="purple">Volver al carrito</Button>
      </Link>
    </Container>
  );
}
