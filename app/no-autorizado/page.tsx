import { Container, Heading, Text } from "@chakra-ui/react";

export default function NoAutorizado() {
  return (
    <Container maxW="container.sm" py={16} textAlign="center">
      <Heading mb={4}>Acceso denegado</Heading>
      <Text color="gray.500">No tenés permisos para acceder a esta página.</Text>
    </Container>
  );
}
