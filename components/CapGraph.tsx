'use client'
import { useState } from 'react'
const P: Record<string, number[]> = { SYSTEMS: [350, 190], PYTHON: [350, 40], FASTAPI: [170, 90], APIS: [540, 90], LLMS: [80, 210], RAG: [190, 330], AGENTS: [350, 340], N8N: [520, 330], WORKFLOWS: [630, 210] }
const ED = [['SYSTEMS', 'PYTHON'], ['SYSTEMS', 'LLMS'], ['SYSTEMS', 'APIS'], ['SYSTEMS', 'WORKFLOWS'], ['PYTHON', 'FASTAPI'], ['FASTAPI', 'APIS'], ['PYTHON', 'LLMS'], ['LLMS', 'RAG'], ['LLMS', 'AGENTS'], ['RAG', 'AGENTS'], ['N8N', 'WORKFLOWS'], ['N8N', 'APIS'], ['N8N', 'AGENTS']]
export default function CapGraph() {
  const [h, setH] = useState<string | null>(null)
  const rel = new Set<string>(h ? [h] : [])
  if (h) ED.forEach(([a, b]) => { if (a === h || b === h) { rel.add(a); rel.add(b) } })
  return (
    <svg id="cg" viewBox="0 0 700 380" role="img" aria-label="Capability dependency graph">
      {ED.map(([a, b], i) => { const on = h && (a === h || b === h); return <line key={i} className={'ce' + (on ? ' hi' : h ? ' dim' : '')} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} /> })}
      {Object.keys(P).map(k => (
        <g key={k} tabIndex={0} className={'cn' + (h === k ? ' hi' : h && !rel.has(k) ? ' dim' : '')} onMouseEnter={() => setH(k)} onMouseLeave={() => setH(null)} onFocus={() => setH(k)} onBlur={() => setH(null)} onClick={() => setH(h === k ? null : k)}>
          <circle cx={P[k][0]} cy={P[k][1]} r={k === 'SYSTEMS' ? 9 : 5} />
          <text x={P[k][0] + (P[k][0] > 350 ? -12 : 12)} y={P[k][1] + (P[k][1] < 100 ? -12 : 20)} textAnchor={P[k][0] > 350 ? 'end' : 'start'}>{k}</text>
        </g>
      ))}
    </svg>
  )
}
