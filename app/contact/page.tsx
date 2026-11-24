import ContactForm from '@/components/ContactForm'
import { getContent } from '@/lib/store'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Contact — AI Foundry' }
export default async function Contact() {
  const { p } = await getContent()
  return (
    <main className="view"><div className="wrap">
      <div className="l">CONTACT</div>
      <h2 className="big" style={{ margin: '18px 0', maxWidth: '14ch' }}>Have a system that should exist?</h2>
      <p style={{ color: 'var(--mute)' }}>Tell me about it.</p>
      <ContactForm />
      <div className="fl" style={{ marginTop: 50 }}>{p.github && <a href={p.github} target="_blank" rel="noopener">GitHub ↗</a>}{p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>}{p.portfolio && <a href={p.portfolio} target="_blank" rel="noopener">Portfolio ↗</a>}</div>
      <h2 style={{ fontSize: 'clamp(48px,13vw,200px)', margin: '60px 0 24px' }}>STILL<br />BUILDING.</h2>
      <p className="l">SYSTEM STATUS · ONLINE &nbsp; LOCATION · {p.location.toUpperCase()} &nbsp; YEAR · 2026</p>
    </div></main>
  )
}
