import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Définit explicitement la racine Turbopack pour éviter l'avertissement
  // « inferred workspace root » quand plusieurs lockfiles sont présents.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
