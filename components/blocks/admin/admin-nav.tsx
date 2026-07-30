"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/inscriptions", label: "Inscriptions", icon: "🎓" },
  { href: "/admin/devis", label: "Devis", icon: "💰" },
  { href: "/admin/messages", label: "Messages", icon: "✉️" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "📰" },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-navy text-white"
                : "text-slate hover:bg-navy-50",
            )}
          >
            <span aria-hidden className="text-base">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
