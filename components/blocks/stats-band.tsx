import { Users, GraduationCap, MapPin, School, Award, type LucideIcon } from "lucide-react";
import { STATS, type Stat } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  users: Users,
  graduation: GraduationCap,
  map: MapPin,
  student: School,
  award: Award,
};

export function StatsBand() {
  return (
    <div className="container-site -mt-14 lg:-mt-20 relative z-20">
      <div className="rounded-3xl bg-white shadow-premium-lg border border-border grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-border overflow-hidden">
        {STATS.map((s: Stat, i: number) => {
          const Icon = icons[s.icon] ?? Award;
          return (
            <div
              key={s.label}
              className={`flex flex-col items-center text-center px-4 py-8 lg:py-10 ${
                i >= 2 ? "border-t border-border lg:border-t-0" : ""
              } ${i === 2 ? "col-span-2 md:col-span-1 lg:col-span-1" : ""}`}
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy mb-4">
                <Icon className="h-7 w-7" />
              </span>
              <p className="font-display text-3xl lg:text-4xl font-bold text-navy">{s.value}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
