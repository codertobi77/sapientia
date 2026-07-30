import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-full overflow-hidden ring-2 ring-gold/30",
        className,
      )}
      aria-hidden
    >
      <Image
        src="/logo.jpeg"
        alt="EFES SAPIENTIA"
        fill
        className="object-cover"
        sizes="48px"
      />
    </span>
  );
}

export function Logo({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <LogoMark className="h-14 w-14" />
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-lg font-bold transition-colors",
            onDark
              ? "text-white group-hover:text-gold"
              : "text-navy group-hover:text-navy-700",
          )}
        >
          EFES « SAPIENTIA »
        </span>
        {!compact && (
          <span className={cn("text-xs", onDark ? "text-white/70" : "text-muted")}>
            Université privée de formation des enseignants
          </span>
        )}
      </span>
    </Link>
  );
}
