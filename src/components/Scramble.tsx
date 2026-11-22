"use client";
import { useEffect, useState } from "react";

const G = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}#%";

// Decodes text from noise left to right, once, after the boot sequence.
export default function Scramble({ text }: { text: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const noisy = (p: number) =>
      text.split("").map((ch, i) => (ch === " " || p * text.length > i ? ch : G[(Math.random() * G.length) | 0])).join("");
    setOut(noisy(0));
    let raf = 0, start = 0;
    const run = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 1100);
      setOut(p < 1 ? noisy(p) : text);
      if (p < 1) raf = requestAnimationFrame(run);
    };
    const delay = document.documentElement.dataset.boot === "1" ? 2200 : 150;
    const to = setTimeout(() => { raf = requestAnimationFrame(run); }, delay);
    return () => { clearTimeout(to); cancelAnimationFrame(raf); };
  }, [text]);
  return <><span className="sr">{text}</span><span aria-hidden>{out}</span></>;
}
