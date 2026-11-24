import Flow from '@/components/Flow'
import { getContent } from '@/lib/store'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Systems — AI Foundry' }
export default async function Work() {
  const { systems } = await getContent()
  return (
    <main className="view"><div className="wrap">
      <div className="l" style={{ marginBottom: 40 }}>SYSTEMS / {String(systems.length).padStart(2, '0')} BUILT</div>
      {systems.map((s, i) => (
        <details className="sys" key={i}>
          <summary><span className="l">SYS.{String(i + 1).padStart(2, '0')}</span><h3>{s.name}</h3><span className="l">{s.type}</span><span className={'l st ' + s.status}>{s.status}</span></summary>
          <div className="body">
            <p>{s.desc}</p><Flow s={s} /><p className="l">{s.tech}</p>
            {([['PROBLEM', s.problem], ['THESIS', s.thesis], ['ARCHITECTURE', s.architecture], ['BUILD', s.build], ['DECISIONS', s.decisions], ['RESULT', s.result], ['LESSONS', s.lessons]] as string[][]).filter(x => x[1]).map(([k, v]) => <div className="cb" key={k}><span className="l">{k}</span><p>{v}</p></div>)}
            <div className="fl">{s.live && <a href={s.live} target="_blank" rel="noopener">Live ↗</a>}{s.source && <a href={s.source} target="_blank" rel="noopener">Source ↗</a>}</div>
          </div>
        </details>
      ))}
    </div></main>
  )
}
