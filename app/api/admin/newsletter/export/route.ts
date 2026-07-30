import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listNewsletter } from "@/lib/data-admin-inbox";
import { buildCsv } from "@/lib/csv";

export async function GET() {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  let subscribers;
  try {
    subscribers = await listNewsletter();
  } catch (err) {
    console.error("[admin/newsletter/export] error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }

  const headers = ["id", "email", "desinscrit", "created_at"];
  const rows = subscribers.map((s) => [
    s.id,
    s.email,
    s.desinscrit ? "oui" : "non",
    s.created_at,
  ]);
  const csv = buildCsv(headers, rows);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter.csv"`,
    },
  });
}
