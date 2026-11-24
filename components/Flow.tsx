import type { Rec } from '@/lib/content'
export default function Flow({ s }: { s: Rec }) {
  return <div className="flow l"><span>INPUT<b>{s.input}</b></span><i /><span>PROCESS<b>{s.process}</b></span><i /><span>OUTPUT<b>{s.output}</b></span></div>
}
