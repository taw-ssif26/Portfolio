import CapGraph from '@/components/CapGraph'
import { getContent } from '@/lib/store'
import { byDate } from '@/lib/content'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Lab — AI Foundry' }
export default async function Lab() {
  const { experiments } = await getContent()
  return (
    <main className="view"><div className="wrap two">
      <div style={{ gridColumn: '1/6' }}><div className="l">EXPERIMENTS</div><h2 className="big" style={{ marginTop: 18 }}>Unfinished on purpose.</h2></div>
      <div style={{ gridColumn: '7/13' }}>{byDate(experiments).map((e, i) => <div className="ex" key={i}><span className="l">{e.date}</span><div><h3>{e.idea}<span className={'bs ' + e.status}>{e.status}</span></h3><p style={{ color: 'var(--mute)', marginTop: 6 }}>{e.line}</p></div></div>)}</div>
      <div style={{ gridColumn: '1/-1', marginTop: 40 }}><div className="l">CAPABILITIES · hover a node</div><CapGraph />
        <div className="cgrp l"><div><b>Build</b>Python, FastAPI, Next.js, APIs</div><div><b>Automate</b>n8n, workflow systems, data processing, integrations</div><div><b>Intelligence</b>LLMs, AI agents, RAG, computer vision</div><div><b>Engineer</b>System architecture, backend, deployment, security</div><div><b>Design</b>UI systems, interaction, motion</div></div></div>
    </div></main>
  )
}
