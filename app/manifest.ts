import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vaultly — Gestão Financeira",
    short_name: "Vaultly",
    description:
      "Plataforma de gestão financeira pessoal com inteligência artificial.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#22c55e",
    orientation: "portrait-primary",
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
