import { getContent } from '@/lib/store'
import { byDate } from '@/lib/content'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'About — AI Foundry' }
export default async function About() {
  const { p, currently, archive } = await getContent()
  return (
    <main className="view"><div className="wrap two">
      <div style={{ gridColumn: '1/7' }}>
        <div className="l">SIGNAL</div><h2 className="big" style={{ margin: '18px 0 0' }}>{p.signal}</h2>
        <div className="facts l"><div>LOCATION<b>{p.location}</b></div><div>FOCUS<b>{p.focus}</b></div><div>STATE<b>{p.state}</b></div></div>
        <p className="philo" style={{ margin: '70px 0' }}>{p.philo}</p>
      </div>
      <div style={{ gridColumn: '8/13' }} className="ph">{p.photo && <img src={p.photo} alt="Portrait of Md Abu Tawsif" />}<h2 aria-hidden="true">TAWSIF</h2></div>
      <div style={{ gridColumn: '1/7' }}><div className="l">ABOUT</div><h3 style={{ fontSize: 'clamp(28px,4vw,56px)', margin: '14px 0 18px' }}>{p.aboutq}</h3><p style={{ color: 'var(--mute)', maxWidth: '46ch' }}>{p.about}</p></div>
      <div style={{ gridColumn: '1/-1' }} className="cur"><div className="l" style={{ border: 0 }}>CURRENTLY</div>{currently.map((c, i) => <div key={i}><span className="l">{c.k}</span><span>{c.v}</span></div>)}<div><span className="l">NOTE</span><span>{p.curious}</span></div></div>
      <div style={{ gridColumn: '1/-1' }}><div className="l" style={{ marginBottom: 14 }}>ARCHIVE</div>{byDate(archive).map((a, i) => <div className="ar" key={i}><span className="l">{a.date}</span><span className="l">{a.kind}</span><span>{a.text}</span></div>)}</div>
    </div></main>
  )
}
