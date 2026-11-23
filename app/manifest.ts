import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marketplace",
    short_name: "Marketplace",
    description: "Encontrá lo que necesitás",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1a1a",
    theme_color: "#6b46c1",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
