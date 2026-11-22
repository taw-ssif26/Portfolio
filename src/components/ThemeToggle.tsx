"use client";
const MODES = ["day", "night", "field"];

export default function ThemeToggle() {
  const set = (m: string) => {
    document.documentElement.dataset.theme = m;
    try { localStorage.setItem("theme", m); } catch {}
  };
  return (
    <span className="tg" role="group" aria-label="Environment">
      {MODES.map((m) => <button key={m} data-t={m} onClick={() => set(m)} aria-label={`${m} environment`}>{m}</button>)}
    </span>
  );
}
