import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("py-12 lg:py-16 relative border-b border-navy/5 last:border-b-0", className)} {...props}>
      <div className="container-site relative z-10">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "text-3xl lg:text-4xl font-bold leading-tight text-pretty",
          light ? "text-white" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-pretty",
            light ? "text-white/80" : "text-slate",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
