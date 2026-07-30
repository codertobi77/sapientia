import { Header } from "@/components/blocks/header";
import { Footer } from "@/components/blocks/footer";
import { WhatsAppButton } from "@/components/blocks/whatsapp-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
