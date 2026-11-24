import HeroSystem from '@/components/HeroSystem'
import { getContent } from '@/lib/store'
export const dynamic = 'force-dynamic'
export default async function Index() {
  const { p } = await getContent()
  return (
    <main className="view hero">
      <div className="meta mono">AI FOUNDRY<br />SYSTEM 01<br />STATUS · BUILDING</div>
      <div className="who mono"><b>MD ABU TAWSIF</b>AI AUTOMATION / PYTHON / SOFTWARE</div>
      <HeroSystem />
      <h1>AI<br />FOUNDRY</h1>
      <p className="lead">{p.lead}<span>{p.sub}</span></p>
    </main>
  )
}
