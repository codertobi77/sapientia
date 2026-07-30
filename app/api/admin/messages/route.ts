import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/api-admin";
import { listMessages } from "@/lib/data-admin-inbox";

export async function GET(request: Request) {
  const guard = await requireAdminOrResponse();
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const luParam = url.searchParams.get("lu");
  const filter =
    luParam === "true"
      ? { lu: true }
      : luParam === "false"
        ? { lu: false }
        : undefined;

  try {
    const messages = await listMessages(filter);
    return NextResponse.json({ data: messages });
  } catch (err) {
    console.error("[admin/messages] list error", err);
    return NextResponse.json({ error: "Erreur de lecture" }, { status: 500 });
  }
}
