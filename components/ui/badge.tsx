import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
  {
    variants: {
      variant: {
        gold: "bg-gold text-navy",
        navy: "bg-navy text-white",
        navyLight: "bg-navy-50 text-navy",
        goldLight: "bg-gold-50 text-gold-600",
        neutral: "bg-slate-100 text-slate-700",
      },
    },
    defaultVariants: { variant: "gold" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
