import Link from "next/link";
import { Container, Heading, Text, Button } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Container maxW="container.sm" py={24} textAlign="center">
      <Text fontSize="7xl" fontWeight="extrabold" color="purple.500" lineHeight={1} mb={4}>
        404
      </Text>
      <Heading size="xl" mb={3}>Página no encontrada</Heading>
      <Text color="gray.500" mb={8}>
        La página que buscás no existe o fue movida.
      </Text>
      <Link href="/">
        <Button colorPalette="purple">Volver al inicio</Button>
      </Link>
    </Container>
  );
}
