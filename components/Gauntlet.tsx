'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
const NAV = [['/', 'INDEX'], ['/work', 'WORK'], ['/lab', 'LAB'], ['/about', 'ABOUT'], ['/contact', 'CONTACT']]
const MODES = ['obsidian', 'paper', 'photon']
const SHORT: Record<string, string> = { obsidian: 'DARK', paper: 'LIGHT', photon: 'FX' }
export default function Gauntlet() {
  const path = usePathname()
  const [mode, setMode] = useState('obsidian')
  useEffect(() => setMode(document.documentElement.dataset.theme || 'obsidian'), [])
  if (path.startsWith('/admin')) return null
  const next = () => {
    const m = MODES[(MODES.indexOf(mode) + 1) % 3]
    document.documentElement.dataset.theme = m
    try { localStorage.setItem('af_theme', m) } catch {}
    setMode(m)
  }
  return (
    <nav className="gt" aria-label="Primary">
      <div className="gi">
        {NAV.map(([h, l], i) => (
          <Link key={h} href={h} className="pl" aria-current={path === h || (h !== '/' && path.startsWith(h)) ? 'page' : undefined}>
            <small>{String(i + 1).padStart(2, '0')}</small>{l}<i />
          </Link>
        ))}
        <span className="rv" />
        <button className="pl md" onClick={next} aria-label={`Mode: ${mode}. Switch mode`}><small>MODE</small>◐ {SHORT[mode]}<i /></button>
      </div>
    </nav>
  )
}
