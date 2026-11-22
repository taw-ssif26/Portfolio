import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";

export async function GET() {
  const rows = await db.select().from(schema.siteSettings);
  return NextResponse.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
}

const body = z.object({ key: z.string().min(1).max(100), value: z.any() });

export async function PUT(req: NextRequest) {
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await db
    .insert(schema.siteSettings)
    .values({ key: p.data.key, value: p.data.value ?? null })
    .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: p.data.value ?? null, updatedAt: new Date() } });
  revalidateTag("settings");
  return NextResponse.json({ ok: true });
}
