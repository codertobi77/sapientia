import { NextResponse } from "next/server";
import { adminGuard, parseJson } from "@/lib/api-admin";
import {
  getGalerieItem,
  updateGalerieItem,
  deleteGalerieItem,
  type GalerieItemInput,
} from "@/lib/data-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;
  const { id } = await params;
  const { data, error } = await getGalerieItem(id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;
  const { id } = await params;
  const { data, response } = await parseJson<GalerieItemInput>(request);
  if (response) return response;
  const updated = await updateGalerieItem(id, data as GalerieItemInput);
  if (updated.error) return NextResponse.json({ error: updated.error }, { status: 400 });
  if (!updated.data) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  return NextResponse.json({ data: updated.data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await adminGuard();
  if (guard.response) return guard.response;
  const { id } = await params;
  const { error } = await deleteGalerieItem(id);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
