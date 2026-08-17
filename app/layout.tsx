import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import Header from "./components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Práctica Final 3 — IAW 2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>
          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
