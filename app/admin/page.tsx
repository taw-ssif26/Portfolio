import Admin, { Login } from '@/components/Admin'
import { isAdmin } from '@/lib/auth'
import { getContent } from '@/lib/store'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin', robots: { index: false, follow: false } }
export default async function Page() {
  if (!(await isAdmin())) return <Login />
  return <Admin initial={await getContent()} />
}
