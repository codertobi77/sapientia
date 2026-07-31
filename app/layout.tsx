import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { getIdentity } from "@/lib/settings";

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

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  const siteName = `${identity.name}`;
  const titleDefault = `${siteName} — ${identity.subtitle}`;
  return {
    title: {
      default: titleDefault,
      template: `%s · ${siteName}`,
    },
    description: `${identity.name}, ${identity.subtitle}. ${identity.address}.`,
    metadataBase: new URL("https://efes-sapientia.bj"),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      title: titleDefault,
      description: identity.subtitle,
    },
  };
}

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
