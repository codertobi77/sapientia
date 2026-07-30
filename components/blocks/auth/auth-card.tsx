import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white text-ink p-8 lg:p-10 shadow-premium-lg animate-fade-in-up">
      <div className="text-center mb-8">
        {eyebrow && (
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="mt-2 text-slate text-sm">{subtitle}</p>}
      </div>
      {children}
      {footer && (
        <div className="mt-6 text-center text-sm text-slate">
          {footer}
        </div>
      )}
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-gold-600 hover:text-gold-600/80 transition-colors">
      {children}
    </Link>
  );
}
