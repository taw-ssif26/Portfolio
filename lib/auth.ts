import { createHmac, createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
const sig = (s: string) => createHmac('sha256', process.env.AUTH_SECRET || '').update(s).digest('hex')
const h = (s: string) => createHash('sha256').update(s).digest()
export const checkPw = (pw: string) => !!process.env.ADMIN_PASSWORD && !!process.env.AUTH_SECRET && timingSafeEqual(h(pw), h(process.env.ADMIN_PASSWORD))
export const makeToken = () => { const e = String(Date.now() + 7 * 864e5); return e + '.' + sig(e) }
export async function isAdmin() {
  if (!process.env.AUTH_SECRET) return false
  const t = (await cookies()).get('af')?.value
  if (!t) return false
  const [e, s] = t.split('.')
  if (!e || !s || Number(e) < Date.now()) return false
  const a = Buffer.from(s), b = Buffer.from(sig(e))
  return a.length === b.length && timingSafeEqual(a, b)
}
