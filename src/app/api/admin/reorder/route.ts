import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { resources } from "@/lib/resources";

const body = z.object({ resource: z.string(), ids: z.array(z.number().int()) });

export async function POST(req: NextRequest) {
  const p = body.safeParse(await req.json().catch(() => null));
  const r = p.success ? resources[p.data.resource] : undefined;
  if (!p.success || !r) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const cols = getTableColumns(r.table) as any;
  if (!cols.sortOrder) return NextResponse.json({ error: "Not orderable" }, { status: 400 });
  // Not atomic; worst case on failure is a half-applied order you can redo.
  await Promise.all(
    p.data.ids.map((id, i) => db.update(r.table).set({ sortOrder: i } as any).where(eq(cols.id, id))),
  );
  revalidateTag(r.tag);
  return NextResponse.json({ ok: true });
}
