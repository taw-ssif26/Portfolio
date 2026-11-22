"use client";
const MODES = ["day", "night", "field"];

// Changing environment sweeps the scan wipe and swaps the theme while the screen is covered.
export default function ThemeToggle() {
  const set = (m: string) => {
    const root = document.documentElement;
    if (root.dataset.theme === m) return;
    const apply = () => { root.dataset.theme = m; try { localStorage.setItem("theme", m); } catch {} };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { apply(); return; }
    const o = document.getElementById("shift");
    o?.classList.remove("go"); void o?.offsetWidth; o?.classList.add("go");
    setTimeout(apply, 320); setTimeout(() => o?.classList.remove("go"), 800);
  };
  return (
    <span className="tg" role="group" aria-label="Environment">
      {MODES.map((m) => <button key={m} data-t={m} onClick={() => set(m)} aria-label={`${m} environment`}>{m}</button>)}
    </span>
  );
}
