import { Box, Container, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={2}>Catálogo</Heading>
      <Text color="gray.500">Los productos se van a mostrar aquí una vez conectada la DB.</Text>
    </Container>
  );
}
