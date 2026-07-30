"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Sheet / slide-over (panneau latéral). Sert pour la sidebar mobile du
 * back-office notamment. Pas de dépendance externe.
 *
 * - `side` : "left" | "right" (défaut right).
 * - Contrôlée par `open` + `onOpenChange`.
 * - Overlay + Échap pour fermer, scroll-lock du body, restore focus.
 * - Pas de focus trap strict (un slide-over filtre rarement le focus) mais Échap
 *   et clic overlay ferment.
 */

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  className,
  children,
  ...props
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const previousFocus = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    previousFocus.current = (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (previousFocus.current && typeof previousFocus.current.focus === "function") {
        previousFocus.current.focus();
      }
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const isLeft = side === "left";

  return (
    <Portal>
      <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
        <div
          aria-hidden
          onClick={() => onOpenChange(false)}
          className="absolute inset-0 bg-navy/50 backdrop-blur-sm animate-fade-in"
        />
        <div
          className={cn(
            "absolute top-0 bottom-0 flex w-full max-w-sm flex-col bg-white shadow-premium-lg border-border",
            isLeft
              ? "left-0 border-r animate-[fade-in_0.2s_ease-out]"
              : "right-0 border-l animate-[fade-in_0.2s_ease-out]",
            className,
          )}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

function Portal({ children }: { children: React.ReactNode }) {
  const [el] = React.useState(() => {
    if (typeof document === "undefined") return null;
    return document.createElement("div");
  });
  React.useEffect(() => {
    if (!el) return;
    document.body.appendChild(el);
    return () => {
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [el]);
  return el ? createPortal(children, el) : null;
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between gap-4 p-4 border-b border-border", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-base font-bold text-navy", className)} {...props} />
  );
}

export function SheetBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />;
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-border p-4", className)} {...props} />
  );
}

export function SheetClose({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Fermer"
      onClick={onClick}
      className="rounded-full p-2 text-muted transition-colors hover:bg-navy-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <X className="h-5 w-5" />
    </button>
  );
}
