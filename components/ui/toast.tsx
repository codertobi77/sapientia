"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Système de toast minimal (pas de lib externe).
 * - <ToastProvider> enveloppe l'app ; useToast() renvoie { push }.
 * - push({ title, description?, variant? }) ajoute un toast qui s'auto-rejette
 *   après `duration` ms (défaut 4000). `variant` : success | error | info.
 * - Rendu en Portal en bas à droite (desktop) / bas (mobile).
 */

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

type ToastInput = Partial<Omit<Toast, "id">> & { title: string };

type ToastCtxValue = {
  push: (t: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastCtxValue | null>(null);

export function ToastProvider({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = React.useCallback(
    (t: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);
      const toast: Toast = {
        id,
        title: t.title,
        description: t.description,
        variant: t.variant ?? "info",
        duration: t.duration ?? 4000,
      };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration > 0) {
        window.setTimeout(() => dismiss(id), toast.duration);
      }
      return id;
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} className={className} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastCtxValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast doit être utilisé à l'intérieur de <ToastProvider>.");
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
  className,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2",
        className,
      )}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>,
    document.body,
  );
}

const ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-navy" />,
};

const ACCENT: Record<ToastVariant, string> = {
  success: "border-l-green-600",
  error: "border-l-red-600",
  info: "border-l-navy",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border border-l-4 bg-white p-4 shadow-premium animate-fade-in-up",
        ACCENT[toast.variant],
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.variant]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-navy">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-sm text-muted leading-snug">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        aria-label="Fermer la notification"
        onClick={onDismiss}
        className="shrink-0 rounded-full p-1 text-muted transition-colors hover:bg-navy-50 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
