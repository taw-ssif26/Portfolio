"use client";
import { useEffect, useState } from "react";

export default function Hud() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = () => setT(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    f(); const i = setInterval(f, 1000); return () => clearInterval(i);
  }, []);
  return (
    <div className="hud mono" aria-hidden>
      <span>UTC+6 {t}</span>
      <span id="hud-xy">X 0000  Y 0000</span>
    </div>
  );
}
