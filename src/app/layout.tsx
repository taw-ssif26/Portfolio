import type { Metadata } from "next";
import { Sora, IBM_Plex_Mono } from "next/font/google";
import { getSettings } from "@/lib/content";
import Stage from "@/components/Stage";
import "./globals.css";

const sans = Sora({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => ({} as Record<string, any>));
  return {
    title: s["seo.title"] ?? "Md Abu Tawsif — AI Systems / Automation / Software",
    description: s["seo.description"] ?? "AI automation, Python and systems engineering portfolio.",
  };
}

const themeInit = `try{var d=document.documentElement,t=localStorage.getItem('theme');if(t!=='day'&&t!=='night'&&t!=='field')t='night';d.dataset.theme=t;d.classList.add('js');if(!sessionStorage.getItem('booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!location.pathname.startsWith('/admin'))d.dataset.boot='1'}catch(e){document.documentElement.dataset.theme='night'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeInit }} /></head>
      <body><Stage />{children}</body>
    </html>
  );
}
