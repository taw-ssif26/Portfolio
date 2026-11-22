"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 1) Reveals: [data-r] elements get .in when scrolled into view.
// 2) System shift: panel anchor clicks sweep a scan wipe, jump while covered.
export default function Fx() {
  const path = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll("[data-r]");
    if (reduce) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !a.closest(".panel")) return;
      const target = document.querySelector(a.hash);
      if (!target) return;
      e.preventDefault();
      if (reduce) { target.scrollIntoView(); return; }
      const o = document.getElementById("shift");
      o?.classList.remove("go"); void o?.offsetWidth; o?.classList.add("go");
      setTimeout(() => { target.scrollIntoView({ behavior: "auto" }); history.replaceState(null, "", a.hash); }, 300);
      setTimeout(() => o?.classList.remove("go"), 800);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <div id="shift" aria-hidden />;
}
