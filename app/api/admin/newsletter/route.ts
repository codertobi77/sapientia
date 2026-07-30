import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listNewsletter } from "@/lib/data-admin-inbox";

export async function GET(request: Request) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const dParam = url.searchParams.get("desinscrit");
  const filter =
    dParam === "true"
      ? { desinscrit: true }
      : dParam === "false"
        ? { desinscrit: false }
        : undefined;

  try {
    const subscribers = await listNewsletter(filter);
    return NextResponse.json({ data: subscribers });
  } catch (err) {
    console.error("[admin/newsletter] list error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}
