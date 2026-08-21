import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import { Box, Flex, Button, Text } from "@chakra-ui/react";

export default async function Header() {
  const { userId } = await auth();

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
        {userId && (
          <Link href="/pedidos">
            <Text fontSize="sm" fontWeight="medium" color="gray.500" _hover={{ color: "purple.500" }}>
              Mis pedidos
            </Text>
          </Link>
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
