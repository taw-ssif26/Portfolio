"use client";
import { useEffect, useState } from "react";

const FRAGMENTS = ["PYTHON", "AI", "AUTOMATION", "SYSTEMS", "MATHEMATICS"];

// Plays once per session, ~1.8s, skippable by click/key. Skipped for reduced-motion.
export default function Boot() {
  const [on, setOn] = useState(true);
  const [n, setN] = useState(0);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const done = () => {
      try { sessionStorage.setItem("booted", "1"); } catch {}
      document.documentElement.removeAttribute("data-boot");
      setOn(false);
    };
    if (document.documentElement.dataset.boot !== "1") { done(); return; }
    const t: ReturnType<typeof setTimeout>[] = [];
    FRAGMENTS.forEach((_, i) => t.push(setTimeout(() => setN(i + 1), 300 + i * 220)));
    t.push(setTimeout(() => setLocked(true), 1500));
    t.push(setTimeout(done, 2200));
    window.addEventListener("keydown", done); window.addEventListener("pointerdown", done);
    return () => { t.forEach(clearTimeout); window.removeEventListener("keydown", done); window.removeEventListener("pointerdown", done); };
  }, []);

  if (!on) return null;
  return (
    <div className="boot mono" role="status" aria-label="Loading">
      <div className="boot-line" />
      <p>{locked ? "MD ABU TAWSIF" : "SYSTEM INITIALIZING"}</p>
      <p style={{ minHeight: 16 }}>{locked ? "AI SYSTEMS / AUTOMATION / SOFTWARE" : FRAGMENTS.slice(0, n).join("  ·  ")}</p>
    </div>
  );
}
