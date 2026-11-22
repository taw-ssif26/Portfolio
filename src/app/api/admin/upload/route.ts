import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Vercel serverless request bodies cap at 4.5MB: images only here.
// For videos, paste a hosted URL (YouTube/Blob) until you add client-side Blob uploads.
const MAX = 4 * 1024 * 1024;
const OK = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

export async function POST(req: NextRequest) {
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!OK.includes(file.type)) return NextResponse.json({ error: "Images only (png/jpg/webp/gif/avif)" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Max 4MB" }, { status: 400 });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blob = await put(`media/${Date.now()}-${safe}`, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
