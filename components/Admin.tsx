'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SCH, Content } from '@/lib/content'
const T: Record<string, string> = { p: 'Profile', systems: 'Systems', experiments: 'Experiments', currently: 'Currently', archive: 'Archive' }
export function Login() {
  const r = useRouter(); const [err, setErr] = useState('')
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ password: new FormData(e.currentTarget).get('pw') }) })
    if (res.ok) r.refresh(); else setErr((await res.json().catch(() => ({}))).error || 'Failed')
  }
  return <main className="view"><form className="adm" onSubmit={go}><h2 className="big">Admin</h2><label><span className="l">PASSWORD</span><input name="pw" type="password" autoComplete="current-password" required /></label><button className="btn">UNLOCK</button>{err && <p className="l" role="alert">{err}</p>}</form></main>
}
export default function Admin({ initial }: { initial: Content }) {
  const r = useRouter()
  const [D, setD] = useState<Content>(initial), [tab, setTab] = useState('p'), [msg, setMsg] = useState('')
  const setP = (k: string, v: string) => setD({ ...D, p: { ...D.p, [k]: v } })
  const setI = (t: string, i: number, k: string, v: string) => setD({ ...D, [t]: (D as any)[t].map((x: any, j: number) => j === i ? { ...x, [k]: v } : x) })
  function field(f: string[], val: string, on: (v: string) => void) {
    const [k, l, t] = f
    if (t === 'a') return <label key={k}><span className="l">{l}</span><textarea value={val || ''} onChange={e => on(e.target.value)} /></label>
    if (t?.startsWith('s:')) return <label key={k}><span className="l">{l}</span><select value={val} onChange={e => on(e.target.value)}>{t.slice(2).split('|').map(o => <option key={o}>{o}</option>)}</select></label>
    if (t === 'img') return <div key={k}><span className="l">{l}</span><br />{val && <img src={val} alt="" style={{ width: 90, filter: 'grayscale(1)' }} />}<br /><input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s; c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height); on(c.toDataURL('image/jpeg', .82)) }; im.src = rd.result as string }; rd.readAsDataURL(f) }} />{val && <button type="button" className="btn mini" onClick={() => on('')}>REMOVE</button>}</div>
    return <label key={k}><span className="l">{l}</span><input value={val || ''} onChange={e => on(e.target.value)} /></label>
  }
  async function save() {
    setMsg('Saving…')
    const res = await fetch('/api/content', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(D) })
    setMsg(res.ok ? 'Saved. The site is updated.' : (await res.json().catch(() => ({}))).error || 'Save failed')
  }
  async function out() { await fetch('/api/login', { method: 'DELETE' }); r.refresh() }
  const add = () => { const o: any = {}; SCH[tab].forEach(f => o[f[0]] = f[2]?.startsWith('s:') ? f[2].slice(2).split('|')[0] : ''); if ('date' in o) o.date = new Date().getFullYear() + ' / ' + String(new Date().getMonth() + 1).padStart(2, '0'); setD({ ...D, [tab]: [o, ...(D as any)[tab]] }) }
  return (
    <main className="view"><div className="adm">
      <div className="savebar"><h2 style={{ fontSize: 32 }}>Admin</h2><span className="l">{msg}</span><span><button className="btn mini" onClick={save}>SAVE</button> <button className="btn mini" onClick={out}>LOG OUT</button></span></div>
      <div className="tabs">{Object.keys(T).map(k => <button key={k} className={k === tab ? 'on' : ''} onClick={() => setTab(k)}>{T[k]}</button>)}</div>
      {tab === 'p' ? <div className="col">{SCH.p.map(f => field(f, D.p[f[0]], v => setP(f[0], v)))}</div> : <>
        {(D as any)[tab].map((it: any, i: number) => <details key={i}><summary>{it[SCH[tab][0][0]] || '(untitled)'}</summary><div>{SCH[tab].map(f => field(f, it[f[0]], v => setI(tab, i, f[0], v)))}<button className="btn mini" onClick={() => confirm('Delete this entry?') && setD({ ...D, [tab]: (D as any)[tab].filter((_: any, j: number) => j !== i) })}>DELETE</button></div></details>)}
        <button className="btn" onClick={add}>ADD ENTRY</button></>}
    </div></main>
  )
}
