import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-navy text-white relative overflow-hidden", className)}>
      {/* motif décoratif */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gold/15 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden />
      <div className="container-site relative py-20 lg:py-28">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">
          {eyebrow}
        </span>
        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] text-balance max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
