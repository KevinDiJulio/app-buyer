import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import Link from "next/link";

export default async function Header() {
  const { userId } = await auth();

  return (
    <header>
      <Link href="/" className="header-marca">Marketplace</Link>
      <nav className="header-nav">
        {userId && (
          <Link href="/pedidos" className="header-link">Mis pedidos</Link>
        )}
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="header-btn">Iniciar sesión</button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </nav>
    </header>
  );
}
