export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  if (!b || b.hp) return Response.json({ ok: true })
  const n = String(b.n || '').replace(/[\r\n]/g, ' ').slice(0, 100), e = String(b.e || ''), t = String(b.t || 'OTHER').replace(/[\r\n]/g, ' ').slice(0, 30), m = String(b.m || '')
  if (!n || !/^\S+@\S+\.\S+$/.test(e) || !m || m.length > 4000) return Response.json({ error: 'Check the form fields.' }, { status: 400 })
  const key = process.env.BREVO_API_KEY, to = process.env.CONTACT_TO, from = process.env.CONTACT_FROM
  if (!key || !to || !from) return Response.json({ error: 'Email is not configured yet.' }, { status: 503 })
  const r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': key, 'content-type': 'application/json' }, body: JSON.stringify({ sender: { email: from, name: 'AI Foundry' }, to: [{ email: to }], replyTo: { email: e, name: n }, subject: `[${t}] ${n}`, textContent: `${m}\n\n${n} <${e}>` }) })
  return r.ok ? Response.json({ ok: true }) : Response.json({ error: 'Sending failed. Try again.' }, { status: 502 })
}
