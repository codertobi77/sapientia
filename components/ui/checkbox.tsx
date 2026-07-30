import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <span className="relative inline-flex h-5 w-5 align-middle">
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "peer h-5 w-5 appearance-none rounded-md border border-border bg-white transition-colors",
        "checked:border-navy checked:bg-navy",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...props}
    />
    <Check
      className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
      strokeWidth={3}
      aria-hidden
    />
  </span>
));
Checkbox.displayName = "Checkbox";
