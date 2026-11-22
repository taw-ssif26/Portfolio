import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { rateLimit } from "@/lib/rate-limit";

const body = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
  website: z.string().optional(), // honeypot: real users leave this empty
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // silently drop bots

  const { name, email, message } = parsed.data;

  // Save first: the message survives even if Brevo is down.
  const [saved] = await db.insert(schema.contactMessages).values({ name, email, message }).returning();

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json" },
    body: JSON.stringify({
      sender: { email: process.env.BREVO_SENDER_EMAIL!, name: "Portfolio" },
      to: [{ email: process.env.CONTACT_TO_EMAIL! }],
      replyTo: { email, name },
      subject: `Portfolio contact: ${name}`,
      textContent: `From: ${name} <${email}>\n\n${message}`,
    }),
  }).catch(() => null);

  if (res?.ok) {
    await db.update(schema.contactMessages).set({ emailed: true }).where(eq(schema.contactMessages.id, saved.id));
  } else {
    console.error("Brevo send failed", res?.status, await res?.text().catch(() => ""));
  }
  // Message is stored either way, so the visitor sees success.
  return NextResponse.json({ ok: true });
}
