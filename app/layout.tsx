import '@fontsource/bricolage-grotesque/300.css'
import '@fontsource/bricolage-grotesque/600.css'
import '@fontsource/bricolage-grotesque/800.css'
import '@fontsource/instrument-sans/400.css'
import '@fontsource/instrument-sans/500.css'
import '@fontsource/jetbrains-mono/400.css'
import './globals.css'
import type { Metadata, Viewport } from 'next'
import Gauntlet from '@/components/Gauntlet'
export const metadata: Metadata = { title: 'AI Foundry — Md Abu Tawsif', description: 'Automation, Python and AI systems by Md Abu Tawsif.' }
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#0b0d10' }
const init = `try{var t=localStorage.getItem('af_theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'paper':'obsidian';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='obsidian'}`
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: init }} />
      </head>
      <body>
        <div className="brand mono"><b>AI FOUNDRY</b>MD ABU TAWSIF</div>
        <div className="stat mono">ONLINE</div>
        {children}
        <Gauntlet />
      </body>
    </html>
  )
}
