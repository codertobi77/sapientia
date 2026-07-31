"use client";

import * as React from "react";
import { Menu, Mail } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetHeader, SheetTitle, SheetBody, SheetClose } from "@/components/ui/sheet";
import { Sidebar } from "@/components/blocks/admin/sidebar";

/**
 * Barre mobile du back-office (sous la topbar). Bouton menu ouvrant un
 * Sheet (slide-over gauche) contenant la sidebar complète, plus un raccourci
 * messages avec badge non lus. Sur desktop ce composant ne s'affiche pas.
 */
export function MobileNav({
  adminName,
  shortName,
  unreadCount = 0,
}: {
  adminName?: string | null;
  shortName: string;
  unreadCount?: number;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-2 border-b border-border bg-navy px-3 py-2.5 md:hidden">
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Menu className="h-6 w-6" />
      </button>

      <span className="font-display text-base font-bold text-white">
        {shortName} · Admin
      </span>

      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/admin/messages"
          aria-label={unreadCount > 0 ? `${unreadCount} message(s) non lu(s)` : "Messages"}
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-navy-700"
        >
          <Mail className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-navy ring-2 ring-navy"
              aria-hidden
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
        {adminName ? (
          <span className="max-w-[7rem] truncate text-sm font-medium text-white/70">
            {adminName}
          </span>
        ) : null}
      </div>

      <Sheet open={open} onOpenChange={setOpen} side="left" className="max-w-xs">
        <SheetHeader>
          <SheetTitle>{shortName} · Admin</SheetTitle>
          <SheetClose onClick={() => setOpen(false)} />
        </SheetHeader>
        <SheetBody>
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetBody>
      </Sheet>
    </div>
  );
}
