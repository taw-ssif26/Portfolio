"use client";
import { useEffect, useRef } from "react";

// Precision marker -> targeting frame on interactive elements. Fine pointers only.
export default function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.35; y += (ty - y) * 0.35;
      if (el.current) el.current.style.transform = `translate(${x}px,${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; if (el.current) el.current.style.opacity = "1"; };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("a,button,input,textarea,select,summary") as HTMLElement | null;
      const c = el.current!; c.classList.toggle("frame", !!t);
      const text = !t ? "" : t.classList.contains("sys") ? "INSPECT"
        : t instanceof HTMLAnchorElement && t.target === "_blank" ? "OPEN" : "";
      if (label.current) label.current.textContent = text;
      c.classList.toggle("wide", !!text);
    };
    addEventListener("pointermove", move); addEventListener("pointerover", over);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); removeEventListener("pointermove", move); removeEventListener("pointerover", over); root.classList.remove("has-cursor"); };
  }, []);

  return <div ref={el} className="cur" aria-hidden><i /><span ref={label} className="mono" /></div>;
}
