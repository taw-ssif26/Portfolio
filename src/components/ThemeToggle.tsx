"use client";
import { playShift } from "@/lib/shift";

const MODES = ["day", "night", "field"];

export default function ThemeToggle() {
  const set = (m: string) => {
    const root = document.documentElement;
    if (root.dataset.theme === m) return;
    playShift(() => { root.dataset.theme = m; try { localStorage.setItem("theme", m); } catch {} });
  };
  return (
    <span className="envsw mono" role="group" aria-label="Environment">
      {MODES.map((m) => (
        <button key={m} data-t={m} onClick={() => set(m)} aria-label={`${m} environment`}>
          <span className="f">{m}</span><span className="s">{m[0]}</span>
        </button>
      ))}
    </span>
  );
}
