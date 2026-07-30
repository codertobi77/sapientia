import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/data-admin-inbox";

const VARIANTS: Record<UserRole, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  ADMIN: { label: "Administrateur", variant: "gold" },
  ENSEIGNANT: { label: "Enseignant", variant: "navyLight" },
  ETUDIANT: { label: "Étudiant", variant: "neutral" },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const v = VARIANTS[role] ?? VARIANTS.ETUDIANT;
  return <Badge variant={v.variant}>{v.label}</Badge>;
}
