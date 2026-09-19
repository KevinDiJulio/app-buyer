import Link from "next/link";
import { Container, Heading, Text, Button } from "@chakra-ui/react";

export default function PagoPendientePage() {
  return (
    <Container maxW="container.sm" py={24} textAlign="center">
      <Text fontSize="5xl" mb={4}>⏳</Text>
      <Heading size="xl" mb={3}>Pago pendiente</Heading>
      <Text color="gray.500" mb={8}>
        Tu pago está siendo procesado. Te avisaremos cuando se confirme.
      </Text>
      <Link href="/pedidos">
        <Button colorPalette="purple">Ver mis pedidos</Button>
      </Link>
    </Container>
  );
}
