import { isAdmin } from '@/lib/auth'
import { saveContent } from '@/lib/store'
import { revalidatePath } from 'next/cache'
export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const c = await req.json().catch(() => null)
  if (!c || !c.p || !Array.isArray(c.systems) || !Array.isArray(c.experiments) || !Array.isArray(c.currently) || !Array.isArray(c.archive)) return Response.json({ error: 'Invalid content' }, { status: 400 })
  try { await saveContent(c) } catch { return Response.json({ error: 'Storage failed. Set DATABASE_URL on Vercel.' }, { status: 500 }) }
  revalidatePath('/', 'layout')
  return Response.json({ ok: true })
}
