import { Users, GraduationCap, MapPin, School, Award, BookOpen, Pin, Hourglass, type LucideIcon } from "lucide-react";
import { getStats } from "@/lib/settings";
import type { Stat } from "@/lib/site-defaults";

const icons: Record<string, LucideIcon> = {
  users: Users,
  graduation: GraduationCap,
  map: MapPin,
  student: School,
  award: Award,
  book: BookOpen,
  pin: Pin,
  hourglass: Hourglass,
};

export async function StatsBand() {
  const stats = await getStats();
  return (
    <div className="container-site py-12 lg:py-16 relative z-20">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-premium-lg border border-border grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-x divide-border overflow-hidden">
        {stats.map((s: Stat, i: number) => {
          const Icon = icons[s.icon] ?? Award;
          return (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center px-4 py-8 lg:py-10 ${
                i >= 2 ? "border-t border-border lg:border-t-0" : ""
              }`}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy mb-3">
                <Icon className="h-6 w-6" />
              </span>
              <p className="font-display text-3xl lg:text-4xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-sm font-medium text-navy/80">{s.label}</p>
              {s.sublabel && (
                <p className="text-xs text-muted mt-0.5">{s.sublabel}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
