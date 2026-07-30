import { NextResponse } from "next/server";
import { adminGuard, parseJson } from "@/lib/api-admin";
import {
  listActualites,
  createActualite,
  type ActualiteInput,
} from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await adminGuard();
  if (guard.response) return guard.response;
  const { data, error } = await listActualites();
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;

  const { data, response } = await parseJson<ActualiteInput>(request);
  if (response) return response;

  const created = await createActualite(data as ActualiteInput);
  if (created.error) return NextResponse.json({ error: created.error }, { status: 400 });
  return NextResponse.json({ data: created.data }, { status: 201 });
}
