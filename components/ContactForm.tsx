'use client'
import { useState } from 'react'
export default function ContactForm() {
  const [s, setS] = useState<'idle' | 'busy' | 'ok' | string>('idle')
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setS('busy')
    const d = new FormData(e.currentTarget)
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ n: d.get('n'), e: d.get('e'), t: d.get('t'), m: d.get('m'), hp: d.get('hp') }) }).catch(() => null)
    if (r && r.ok) { setS('ok'); (e.target as HTMLFormElement).reset() } else setS((r && (await r.json().catch(() => ({}))).error) || 'Network error.')
  }
  return (
    <form onSubmit={go}>
      <label><span className="l">NAME</span><input name="n" required maxLength={100} /></label>
      <label><span className="l">EMAIL</span><input name="e" type="email" required /></label>
      <label><span className="l">PROJECT TYPE</span><select name="t"><option>AUTOMATION</option><option>AI SYSTEM</option><option>WEB APPLICATION</option><option>EXPERIMENT</option><option>OTHER</option></select></label>
      <label><span className="l">MESSAGE</span><textarea name="m" rows={4} required maxLength={4000} /></label>
      <input className="hp" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn" disabled={s === 'busy'}>{s === 'busy' ? 'TRANSMITTING…' : s === 'ok' ? 'TRANSMISSION SENT' : 'SEND TRANSMISSION'}</button>
      {s !== 'idle' && s !== 'busy' && s !== 'ok' && <p className="l" role="alert">{s}</p>}
    </form>
  )
}
