import { checkPw, makeToken } from '@/lib/auth'
const tries = new Map<string, { c: number; t: number }>()
export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'x'
  const r = tries.get(ip) || { c: 0, t: Date.now() }
  if (Date.now() - r.t > 9e5) { r.c = 0; r.t = Date.now() }
  if (r.c >= 5) return Response.json({ error: 'Too many attempts. Wait 15 minutes.' }, { status: 429 })
  const b = await req.json().catch(() => ({}))
  if (!checkPw(String(b.password || ''))) { r.c++; tries.set(ip, r); return Response.json({ error: 'Wrong password.' }, { status: 401 }) }
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', `af=${makeToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
  return res
}
export async function DELETE() {
  const res = Response.json({ ok: true })
  res.headers.append('Set-Cookie', 'af=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0')
  return res
}
