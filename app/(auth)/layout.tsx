import { Logo } from "@/components/blocks/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col">
      <div className="container-site py-6">
        <Logo onDark />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
