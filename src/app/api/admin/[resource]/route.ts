import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { asc, count, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { resources, clean } from "@/lib/resources";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_: NextRequest, { params }: Ctx) {
  const r = resources[(await params).resource];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const cols = getTableColumns(r.table) as any;
  const rows = await db.select().from(r.table).orderBy(asc(cols.sortOrder ?? cols.id));
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const name = (await params).resource;
  const r = resources[name];
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  if (name === "projects" && !/^[a-z0-9-]+$/.test(body.slug ?? "")) {
    return NextResponse.json({ error: "slug must be lowercase letters, digits, hyphens" }, { status: 400 });
  }
  const data = clean(r.table, body);
  const cols = getTableColumns(r.table) as any;
  if (cols.sortOrder && data.sortOrder === undefined) {
    const res = (await db.select({ n: count() }).from(r.table)) as any[];
    data.sortOrder = res[0]?.n ?? 0;
  }
  try {
    const [row] = (await db.insert(r.table).values(data as any).returning()) as any[];
    revalidateTag(r.tag);
    return NextResponse.json(row, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
