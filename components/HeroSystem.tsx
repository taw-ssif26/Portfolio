'use client'
import { useEffect, useRef } from 'react'
export default function HeroSystem() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = ref.current!, NS = 'http://www.w3.org/2000/svg'
    const mk = (t: string, a: any, p: Element) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e }
    const R = [70, 130, 190, 250], cnt = [3, 5, 7, 9], N: any[] = [], E: any[] = [], mouse = { x: -999, y: -999 }
    const labs = ['INPUT', 'PARSE', 'EMBED', 'INDEX', 'ROUTE', 'SCORE', 'QUEUE', 'RETRY', 'EMIT', 'LOG']
    R.forEach((r, i) => mk('circle', { cx: 300, cy: 300, r, class: 'ln' + (i % 2 ? ' ds' : '') }, svg))
    for (let i = 0; i < 72; i++) { const a = i / 72 * 6.283, l = i % 6 ? 5 : 12; mk('line', { x1: 300 + Math.cos(a) * 262, y1: 300 + Math.sin(a) * 262, x2: 300 + Math.cos(a) * (262 + l), y2: 300 + Math.sin(a) * (262 + l), class: 'tk' }, svg) }
    mk('text', { x: 300, y: 22, class: 'tx', 'text-anchor': 'middle' }, svg).textContent = 'θ 000° — FIELD 03'
    R.forEach((r, k) => { for (let j = 0; j < cnt[k]; j++) N.push({ k, r, a: j / cnt[k] * 6.283 + k * .7, x: 0, y: 0 }) })
    N.forEach(n => { const nx = N.find(m => m.k === n.k && m !== n && m.a > n.a) || N.find(m => m.k === n.k && m !== n); nx && E.push([n, nx]); const up = N.filter(m => m.k === n.k + 1).sort((a, b) => Math.abs(a.a - n.a) - Math.abs(b.a - n.a))[0]; up && E.push([n, up]) })
    const L = E.map(() => mk('line', { class: 'ln' }, svg))
    const S = Array.from({ length: 7 }, (_, i) => ({ e: i * 3 % E.length, t: Math.random(), el: mk('circle', { r: 2.4, class: 'sg' }, svg) }))
    const lab = mk('text', { class: 'tx', style: 'fill:var(--fg)' }, svg)
    let timer: any
    const NE = N.map((n, i) => { const c = mk('circle', { r: 4, class: 'nd' }, svg); c.addEventListener('click', () => { lab.textContent = labs[i % 10] + ' · N' + String(i).padStart(2, '0'); lab.setAttribute('x', String(n.x + 9)); lab.setAttribute('y', String(n.y - 9)); clearTimeout(timer); timer = setTimeout(() => lab.textContent = '', 2200) }); return c })
    const mv = (e: MouseEvent) => { const b = svg.getBoundingClientRect(); mouse.x = (e.clientX - b.left) / b.width * 600; mouse.y = (e.clientY - b.top) / b.height * 600 }
    addEventListener('mousemove', mv)
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf = 0
    const loop = () => {
      const t = performance.now() / 1000
      N.forEach(n => { const a = n.a + t * .02 * (n.k + 1) * (n.k % 2 ? -1 : 1) * .3; let x = 300 + Math.cos(a) * n.r, y = 300 + Math.sin(a) * n.r; const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy); if (d < 110 && d > 0) { const f = (1 - d / 110) * 30; x += dx / d * f; y += dy / d * f } n.x = x; n.y = y })
      NE.forEach((c, i) => { c.setAttribute('cx', N[i].x); c.setAttribute('cy', N[i].y) })
      E.forEach((e, i) => { const l = L[i]; l.setAttribute('x1', e[0].x); l.setAttribute('y1', e[0].y); l.setAttribute('x2', e[1].x); l.setAttribute('y2', e[1].y) })
      S.forEach(s => { s.t += .006; if (s.t > 1) { s.t = 0; s.e = (s.e + 5) % E.length } const e = E[s.e]; s.el.setAttribute('cx', e[0].x + (e[1].x - e[0].x) * s.t); s.el.setAttribute('cy', e[0].y + (e[1].y - e[0].y) * s.t) })
      if (!reduce) raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); removeEventListener('mousemove', mv); svg.innerHTML = '' }
  }, [])
  return <svg id="sys" ref={ref} viewBox="0 0 600 600" aria-hidden="true" />
}
