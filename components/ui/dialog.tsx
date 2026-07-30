"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dialog/modal accessible minimaliste (pas de @radix-ui).
 * - Overlay + contenu centré, fermeture par Échap ou clic overlay.
 * - Focus trap léger : au montage, focus le premier élément focusable du
 *   dialog (ou le panel lui-même) ; Tab/Shift+Tab reste dans le dialog.
 * - Verrouille le scroll du body quand ouvert.
 * - Restore le focus sur l'élément qui avait le focus avant ouverture.
 *
 * Contrôlée par `open` + `onOpenChange`. Le contenu se monte via Portal
 * sur document.body (évite les soucis de stacking context / overflow:hidden).
 */

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onOpenChange,
  className,
  children,
  ...props
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const previousFocus = React.useRef<HTMLElement | null>(null);

  // Lock scroll + mount sur body via Portal.
  React.useEffect(() => {
    if (!open) return;
    previousFocus.current =
      (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [open]);

  // Focus initial + restore.
  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panel).focus();
    }, 0);
    return () => {
      window.clearTimeout(t);
      if (previousFocus.current && typeof previousFocus.current.focus === "function") {
        previousFocus.current.focus();
      }
    };
  }, [open]);

  // Échap pour fermer.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const nodes = Array.from(
      panel.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((el) => el.offsetParent !== null || el === panel);
    if (nodes.length === 0) {
      e.preventDefault();
      panel.focus();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !panel.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !panel.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          aria-hidden
          onClick={() => onOpenChange(false)}
          className="absolute inset-0 bg-navy/50 backdrop-blur-sm animate-fade-in"
        />
        <div
          ref={panelRef}
          tabIndex={-1}
          onKeyDown={onPanelKeyDown}
          className={cn(
            "relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-premium-lg",
            "border border-border animate-fade-in-up",
            "outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

// Portal local : createPortal n'est utilisable qu'au client ; ok via 'use client'.
function Portal({ children }: { children: React.ReactNode }) {
  const [el] = React.useState(() => {
    if (typeof document === "undefined") return null;
    const node = document.createElement("div");
    return node;
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

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4 p-6 pb-0", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-bold text-navy leading-tight", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted leading-relaxed", className)} {...props} />
  );
}

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-4", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 p-6 pt-0", className)}
      {...props}
    />
  );
}

export function DialogClose({ onClick }: { onClick?: () => void }) {
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
