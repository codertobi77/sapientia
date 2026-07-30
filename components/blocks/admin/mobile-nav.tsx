"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetHeader, SheetTitle, SheetBody, SheetClose } from "@/components/ui/sheet";
import { Sidebar } from "@/components/blocks/admin/sidebar";
import { SITE } from "@/lib/site";

/**
 * Barre mobile du back-office : bouton menu qui ouvre un Sheet (slide-over
 * gauche) contenant la sidebar. Sur desktop ce composant ne s'affiche pas.
 */
export function MobileNav({ adminName }: { adminName?: string | null }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex items-center gap-3 border-b border-border bg-navy px-4 py-3 md:hidden">
      <button
        type="button"
        aria-label="Ouvrir le menu"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 text-white transition-colors hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Menu className="h-6 w-6" />
      </button>
      <span className="font-display text-base font-bold text-white">
        {SITE.shortName} · Admin
      </span>
      {adminName ? (
        <span className="ml-auto text-sm font-medium text-white/70">
          {adminName}
        </span>
      ) : null}

      <Sheet open={open} onOpenChange={setOpen} side="left" className="max-w-xs">
        <SheetHeader>
          <SheetTitle>{SITE.shortName} · Admin</SheetTitle>
          <SheetClose onClick={() => setOpen(false)} />
        </SheetHeader>
        <SheetBody>
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetBody>
      </Sheet>
    </div>
  );
}
