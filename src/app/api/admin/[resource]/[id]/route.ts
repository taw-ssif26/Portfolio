import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { resources, clean } from "@/lib/resources";

type Ctx = { params: Promise<{ resource: string; id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { resource, id } = await params;
  const r = resources[resource];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  const cols = getTableColumns(r.table) as any;
  const data = clean(r.table, body);
  if (cols.updatedAt) data.updatedAt = new Date();
  try {
    const [row] = (await db.update(r.table).set(data as any).where(eq(cols.id, Number(id))).returning()) as any[];
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    revalidateTag(r.tag);
    return NextResponse.json(row);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { resource, id } = await params;
  const r = resources[resource];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const cols = getTableColumns(r.table) as any;
  await db.delete(r.table).where(eq(cols.id, Number(id)));
  revalidateTag(r.tag);
  return NextResponse.json({ ok: true });
}
