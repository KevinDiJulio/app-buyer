import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import BtnColorMode from "./BtnColorMode";

export default async function Header() {
  const { userId, sessionClaims } = await auth();
  const esAdmin = (sessionClaims?.metadata as { role?: string })?.role === "admin";

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="100"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={{ base: 4, md: 8 }}
      h="60px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      backdropFilter="blur(12px)"
      _dark={{ bg: "gray.900", borderColor: "gray.700" }}
    >
      <Link href="/">
        <Text
          fontWeight="bold"
          fontSize="lg"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Marketplace
        </Text>
      </Link>

      <Flex as="nav" alignItems="center" gap={4}>
        <BtnColorMode />
        {userId && (
          <Link href="/carrito">
            <Text fontSize="sm" fontWeight="medium" color="gray.500" _hover={{ color: "purple.500" }}>
              🛒 Mi carrito
            </Text>
          </Link>
        )}
        {userId && (
          <Link href="/pedidos">
            <Text fontSize="sm" fontWeight="medium" color="gray.500" _hover={{ color: "purple.500" }}>
              Mis pedidos
            </Text>
          </Link>
        )}
        {esAdmin && (
          <>
            <Box w="1px" h="20px" bg="gray.300" _dark={{ bg: "gray.600" }} />
            <Flex gap={2} alignItems="center">
              <Link href="/admin">
                <Box
                  px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold"
                  bg="orange.100" color="orange.700" border="1px solid" borderColor="orange.300"
                  _hover={{ bg: "orange.200" }}
                  _dark={{ bg: "orange.900", color: "orange.200", borderColor: "orange.700", _hover: { bg: "orange.800" } }}
                >
                  Productos
                </Box>
              </Link>
              <Link href="/admin/pedidos">
                <Box
                  px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="semibold"
                  bg="orange.100" color="orange.700" border="1px solid" borderColor="orange.300"
                  _hover={{ bg: "orange.200" }}
                  _dark={{ bg: "orange.900", color: "orange.200", borderColor: "orange.700", _hover: { bg: "orange.800" } }}
                >
                  Pedidos
                </Box>
              </Link>
            </Flex>
          </>
        )}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button size="sm" colorPalette="purple">
              Iniciar sesión
            </Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </Flex>
    </Box>
  );
}
