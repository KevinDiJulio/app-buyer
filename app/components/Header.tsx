import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import Link from "next/link";

export default async function Header() {
  const { userId } = await auth();

  return (
    <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.200" px={6} py={3}>
      <Flex justify="space-between" align="center">
        <Heading as="span" size="md">
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            Marketplace
          </Link>
        </Heading>
        <Flex gap={4} align="center">
          {userId && (
            <Link href="/pedidos" style={{ fontSize: "14px" }}>
              Mis pedidos
            </Link>
          )}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button size="sm" colorPalette="blue">
                Iniciar sesión
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Flex>
      </Flex>
    </Box>
  );
}
