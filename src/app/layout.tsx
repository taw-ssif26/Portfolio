import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { getSettings } from "@/lib/content";
import Stage from "@/components/Stage";
import "./globals.css";

// Clash Display (headlines) + Satoshi (text) come from Fontshare, free for commercial use.
// Geist Mono (labels, readouts) is self-hosted by next/font.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const FONTS = "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap";

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
    <html lang="en" suppressHydrationWarning className={mono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body><Stage />{children}</body>
    </html>
  );
}
