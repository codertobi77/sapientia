import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Définit explicitement la racine Turbopack pour éviter l'avertissement
  // « inferred workspace root » quand plusieurs lockfiles sont présents.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
