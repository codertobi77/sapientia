import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EFES « SAPIENTIA » — Université privée de formation des enseignants",
    template: "%s · EFES « SAPIENTIA »",
  },
  description:
    "EFES « SAPIENTIA », université privée de formation des enseignants au Bénin. Formations en présentiel et à distance à Porto-Novo, Parakou, Savè et Abomey-Calavi.",
  metadataBase: new URL("https://efes-sapientia.bj"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "EFES « SAPIENTIA » — Université privée de formation des enseignants",
    description:
      "Formations en présentiel et à distance. Plus de 17 membres fondateurs, présence à Porto-Novo, Parakou, Savè et Abomey-Calavi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
