import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkCredentials, createSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const body = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`login:${ip}`, 5, 15 * 60_000)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !(await checkCredentials(parsed.data.email, parsed.data.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
