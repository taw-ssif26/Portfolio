import { useState, useEffect, useRef } from "react";

const ACCENT = "#00FF88";
const ACCENT_DIM = "#00CC6A";
const ACCENT_GLOW = "rgba(0,255,136,0.15)";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080808;
      --bg2: #0E0E0E;
      --bg3: #141414;
      --line: rgba(255,255,255,0.06);
      --line2: rgba(255,255,255,0.12);
      --text: #E8E8E8;
      --muted: #888;
      --accent: #00FF88;
      --accent-dim: #00CC6A;
      --accent-glow: rgba(0,255,136,0.12);
      --accent-glow2: rgba(0,255,136,0.25);
      --font-head: 'Syne', sans-serif;
      --font-body: 'Outfit', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }

    html { scroll-behavior: smooth; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-weight: 300;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent-dim); border-radius: 2px; }

    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 4rem;
      background: rgba(8,8,8,0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--line);
    }
    .nav-logo { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent); letter-spacing: 0.15em; }
    .nav-links { display: flex; gap: 2.5rem; }
    .nav-link {
      font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted);
      text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase;
      transition: color 0.2s; cursor: pointer; background: none; border: none;
    }
    .nav-link:hover { color: var(--accent); }

    .grid-bg {
      position: absolute; inset: 0; overflow: hidden; pointer-events: none;
      background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 100%);
    }

    .hero {
      min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr;
      align-items: center; padding: 8rem 4rem 4rem; position: relative; overflow: hidden;
    }
    .hero-left { position: relative; z-index: 1; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent);
      letter-spacing: 0.15em; text-transform: uppercase;
      border: 1px solid rgba(0,255,136,0.3); padding: 6px 14px; border-radius: 2px; margin-bottom: 2rem;
    }
    .hero-badge::before {
      content: ''; width: 6px; height: 6px; background: var(--accent);
      border-radius: 50%; animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
    .hero-h1 {
      font-family: var(--font-head); font-size: clamp(2.4rem, 4vw, 3.8rem);
      font-weight: 800; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 1.5rem;
    }
    .hero-h1 span { color: var(--accent); }
    .hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.7; max-width: 480px; margin-bottom: 2.5rem; font-weight: 300; }
    .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-primary {
      background: var(--accent); color: #000; font-family: var(--font-mono);
      font-size: 0.75rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 12px 28px; border: none; border-radius: 2px; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary:hover { background: #fff; transform: translateY(-2px); }
    .btn-ghost {
      background: transparent; color: var(--text); font-family: var(--font-mono);
      font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
      padding: 11px 28px; border: 1px solid var(--line2); border-radius: 2px; cursor: pointer; transition: all 0.2s;
    }
    .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

    .terminal {
      background: rgba(14,14,14,0.9); border: 1px solid rgba(0,255,136,0.2);
      border-radius: 6px; overflow: hidden; position: relative; z-index: 1;
    }
    .terminal-bar {
      background: #1a1a1a; padding: 10px 16px;
      display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--line);
    }
    .t-dot { width: 10px; height: 10px; border-radius: 50%; }
    .t-title { font-family: var(--font-mono); font-size: 0.7rem; color: var(--muted); margin-left: 8px; }
    .terminal-body { padding: 1.25rem 1.5rem; min-height: 280px; }
    .t-line { font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.9; display: flex; align-items: flex-start; gap: 8px; }
    .t-prefix { color: var(--accent); user-select: none; }
    .t-text { color: #bbb; }
    .t-text.success { color: var(--accent); }
    .t-text.warn { color: #f5a623; }
    .t-text.info { color: #5bc8fd; }
    .t-cursor { display: inline-block; width: 8px; height: 14px; background: var(--accent); animation: blink 1s step-end infinite; vertical-align: text-bottom; margin-left: 2px; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .section { padding: 7rem 4rem; position: relative; }
    .section-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1rem; }
    .section-h2 { font-family: var(--font-head); font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 800; letter-spacing: -0.02em; margin-bottom: 1rem; }
    .section-sub { color: var(--muted); font-size: 0.95rem; line-height: 1.7; max-width: 520px; margin-bottom: 4rem; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, var(--line2) 30%, var(--line2) 70%, transparent); }

    .cards-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5px; }
    .service-card {
      background: var(--bg2); border: 1px solid var(--line);
      padding: 2.5rem 2rem; position: relative; overflow: hidden; transition: border-color 0.3s, background 0.3s; cursor: default;
    }
    .service-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
    }
    .service-card:hover { border-color: rgba(0,255,136,0.25); background: var(--bg3); }
    .service-card:hover::before { transform: scaleX(1); }
    .card-icon { width: 42px; height: 42px; border: 1px solid rgba(0,255,136,0.3); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; border-radius: 4px; font-size: 1.2rem; }
    .card-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
    .card-desc { color: var(--muted); font-size: 0.88rem; line-height: 1.75; }

    .projects-list { display: flex; flex-direction: column; gap: 2px; }
    .project-card { background: var(--bg2); border: 1px solid var(--line); padding: 3rem; position: relative; overflow: hidden; transition: border-color 0.3s; }
    .project-card:hover { border-color: rgba(0,255,136,0.2); }
    .project-num { font-family: var(--font-mono); font-size: 0.7rem; color: rgba(0,255,136,0.4); letter-spacing: 0.2em; margin-bottom: 1rem; }
    .project-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
    .project-h3 { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
    .project-tagline { color: var(--muted); font-size: 0.9rem; line-height: 1.65; margin-bottom: 1.5rem; }
    .feat-list { list-style: none; margin-bottom: 1.5rem; }
    .feat-list li { font-family: var(--font-mono); font-size: 0.75rem; color: #999; padding: 4px 0; display: flex; align-items: center; gap: 8px; }
    .feat-list li::before { content: '→'; color: var(--accent); }
    .stack-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.5rem; }
    .badge { font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent); border: 1px solid rgba(0,255,136,0.3); padding: 3px 10px; border-radius: 2px; letter-spacing: 0.05em; }
    .project-btns { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-sm { font-family: var(--font-mono); font-size: 0.7rem; letter-spacing: 0.08em; padding: 7px 16px; border-radius: 2px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
    .btn-sm.outline { background: transparent; color: var(--muted); border: 1px solid var(--line2); }
    .btn-sm.outline:hover { border-color: var(--accent); color: var(--accent); }

    .flow-diagram { background: var(--bg); border: 1px solid var(--line); border-radius: 4px; padding: 1.5rem; position: relative; }
    .flow-node { background: var(--bg3); border: 1px solid var(--line2); border-radius: 3px; padding: 8px 14px; font-family: var(--font-mono); font-size: 0.7rem; color: #bbb; text-align: center; position: relative; transition: border-color 0.3s, color 0.3s; }
    .flow-node.active { border-color: rgba(0,255,136,0.5); color: var(--accent); }
    .flow-arrow { text-align: center; color: rgba(0,255,136,0.4); font-size: 0.8rem; padding: 3px 0; font-family: var(--font-mono); animation: flowPulse 2s ease-in-out infinite; }
    @keyframes flowPulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

    .arch-section { background: var(--bg2); }
    .arch-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: start; }
    .arch-nodes { display: flex; flex-direction: column; gap: 0; }
    .arch-node { display: flex; align-items: center; padding: 1rem 1.5rem; border-left: 2px solid var(--line2); cursor: pointer; transition: all 0.2s; position: relative; }
    .arch-node::before { content: ''; position: absolute; left: -5px; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; background: var(--bg2); border: 2px solid var(--line2); transition: all 0.2s; }
    .arch-node.active { border-left-color: var(--accent); background: var(--accent-glow); }
    .arch-node.active::before { border-color: var(--accent); background: var(--accent); box-shadow: 0 0 8px var(--accent-glow2); }
    .arch-node-label { font-family: var(--font-head); font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
    .arch-node-sub { font-family: var(--font-mono); font-size: 0.68rem; color: var(--muted); }
    .arch-detail { background: var(--bg); border: 1px solid var(--line); padding: 2rem; border-radius: 4px; min-height: 200px; }
    .arch-detail-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; color: var(--accent); margin-bottom: 0.75rem; }
    .arch-detail-desc { color: var(--muted); font-size: 0.87rem; line-height: 1.7; margin-bottom: 1rem; }
    .arch-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .arch-tag { font-family: var(--font-mono); font-size: 0.65rem; color: #666; border: 1px solid var(--line); padding: 3px 10px; border-radius: 2px; }

    .tech-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 1px; margin-top: 3rem; }
    .tech-category { background: var(--bg2); border: 1px solid var(--line); padding: 1.5rem; }
    .tech-cat-label { font-family: var(--font-mono); font-size: 0.65rem; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--line); }
    .tech-item { font-family: var(--font-mono); font-size: 0.75rem; color: #999; padding: 5px 0; display: flex; align-items: center; gap: 6px; transition: color 0.2s; }
    .tech-item:hover { color: var(--accent); }
    .tech-item::before { content: '_'; color: rgba(0,255,136,0.3); }

    .timeline { position: relative; padding-left: 2rem; }
    .timeline::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 1px; background: linear-gradient(180deg, var(--accent) 0%, rgba(0,255,136,0.1) 100%); }
    .timeline-item { position: relative; padding: 0 0 3rem 2.5rem; }
    .timeline-dot { position: absolute; left: -2.5rem; width: 12px; height: 12px; border-radius: 50%; background: var(--bg); border: 2px solid var(--accent); top: 4px; transition: background 0.3s; }
    .timeline-item:hover .timeline-dot { background: var(--accent); }
    .timeline-date { font-family: var(--font-mono); font-size: 0.68rem; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 6px; }
    .timeline-title { font-family: var(--font-head); font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .timeline-desc { color: var(--muted); font-size: 0.85rem; line-height: 1.65; }

    .case-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5px; }
    .case-card { background: var(--bg2); border: 1px solid var(--line); padding: 2.5rem; cursor: pointer; transition: border-color 0.3s, background 0.3s; position: relative; }
    .case-card:hover { border-color: rgba(0,255,136,0.25); background: var(--bg3); }
    .case-problem { font-family: var(--font-mono); font-size: 0.68rem; color: #f5a623; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
    .case-title { font-family: var(--font-head); font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; }
    .case-body { color: var(--muted); font-size: 0.85rem; line-height: 1.7; }
    .case-result { margin-top: 1.5rem; padding: 1rem; background: var(--accent-glow); border-left: 2px solid var(--accent); font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent); }
    .expand-indicator { position: absolute; bottom: 1.5rem; right: 1.5rem; font-family: var(--font-mono); font-size: 0.65rem; color: var(--muted); }
    .case-expanded { margin-top: 1.5rem; border-top: 1px solid var(--line); padding-top: 1.5rem; }
    .case-row { display: flex; gap: 1rem; margin-bottom: 0.75rem; }
    .case-row-label { font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent); min-width: 90px; }
    .case-row-val { font-size: 0.83rem; color: #bbb; line-height: 1.6; }

    .contact-section { min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; position: relative; overflow: hidden; }
    .contact-h { font-family: var(--font-head); font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; letter-spacing: -0.03em; margin-bottom: 1rem; }
    .contact-h span { color: var(--accent); }
    .contact-sub { color: var(--muted); font-size: 1rem; margin-bottom: 3rem; }
    .contact-links { display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap; }
    .contact-link { font-family: var(--font-mono); font-size: 0.8rem; color: var(--muted); text-decoration: none; letter-spacing: 0.08em; padding: 10px 20px; border: 1px solid var(--line2); border-radius: 2px; transition: all 0.2s; cursor: pointer; }
    .contact-link:hover { border-color: var(--accent); color: var(--accent); }
    .contact-terminal { margin-top: 3rem; background: var(--bg2); border: 1px solid rgba(0,255,136,0.2); padding: 1rem 1.5rem; font-family: var(--font-mono); font-size: 0.82rem; color: var(--muted); border-radius: 3px; min-width: 360px; }
    .contact-input { background: transparent; border: none; color: var(--text); font-family: var(--font-mono); font-size: 0.82rem; outline: none; width: 280px; caret-color: var(--accent); }

    .loading-screen { position: fixed; inset: 0; z-index: 9999; background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; transition: opacity 0.6s, visibility 0.6s; }
    .loading-screen.done { opacity: 0; visibility: hidden; pointer-events: none; }
    .loading-bar-track { width: 240px; height: 1px; background: var(--line2); }
    .loading-bar-fill { height: 1px; background: var(--accent); transition: width 0.3s ease; }
    .loading-text { font-family: var(--font-mono); font-size: 0.72rem; color: var(--muted); letter-spacing: 0.08em; }
    .loading-logo { font-family: var(--font-head); font-size: 1.6rem; font-weight: 800; color: var(--accent); letter-spacing: 0.05em; }

    .glow-blob { position: absolute; pointer-events: none; border-radius: 50%; filter: blur(80px); opacity: 0.08; }

    .fade-section { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
    .fade-section.visible { opacity: 1; transform: translateY(0); }

    @media (max-width: 900px) {
      .nav { padding: 1rem 1.5rem; }
      .nav-links { display: none; }
      .hero { grid-template-columns: 1fr; padding: 6rem 1.5rem 3rem; gap: 2.5rem; }
      .section { padding: 5rem 1.5rem; }
      .cards-grid { grid-template-columns: 1fr; }
      .project-inner { grid-template-columns: 1fr; }
      .arch-grid { grid-template-columns: 1fr; }
      .tech-grid { grid-template-columns: repeat(2,1fr); }
      .case-grid { grid-template-columns: 1fr; }
      .contact-terminal { min-width: unset; width: 100%; }
    }
  `}</style>
);

const TERMINAL_LOGS = [
  [
    { text: "Initializing email monitor...", type: "info" },
    { text: "Gmail API connected", type: "success" },
    { text: "Scanning inbox — 12 unread", type: "" },
    { text: "Running AI classification...", type: "info" },
    { text: "Category: Urgent (invoice deadline)", type: "warn" },
    { text: "Draft reply generated ✓", type: "success" },
    { text: "Label applied: /Urgent", type: "success" },
    { text: "Pipeline completed in 4.2s", type: "success" },
  ],
  [
    { text: "Telegram bot listening...", type: "info" },
    { text: "Incoming: 'I need an appointment'", type: "" },
    { text: "Intent detected: booking", type: "info" },
    { text: "Checking availability...", type: "" },
    { text: "Slot available: Mon 10:00 AM", type: "success" },
    { text: "Booking confirmed ✓", type: "success" },
    { text: "Reminder scheduled: -24h", type: "info" },
    { text: "Admin notified via webhook", type: "success" },
  ],
  [
    { text: "Browser engine starting...", type: "info" },
    { text: "Chromium instance launched", type: "" },
    { text: "Navigating to target...", type: "info" },
    { text: "Form detected — 7 fields", type: "" },
    { text: "Autofill in progress...", type: "info" },
    { text: "Captcha bypass: success", type: "success" },
    { text: "Data extracted: 248 rows", type: "success" },
    { text: "Session closed cleanly ✓", type: "success" },
  ],
];

const ARCH_NODES = [
  {
    label: "Input Layer",
    sub: "Triggers, webhooks, APIs",
    detail:
      "All automation workflows begin at structured entry points — Gmail triggers, Telegram webhooks, scheduled crons, or REST API calls. Zero manual intervention required.",
    tags: ["Gmail API", "Telegram Bot API", "n8n Webhooks", "REST Triggers"],
  },
  {
    label: "Orchestration Engine",
    sub: "n8n workflow automation",
    detail:
      "n8n handles the control flow — routing, conditional branching, retry logic, error handling, and parallel execution. Self-hosted on low-cost infrastructure.",
    tags: ["n8n", "Conditional Routing", "Error Handling", "Retry Logic"],
  },
  {
    label: "AI Processing",
    sub: "Claude / Groq inference",
    detail:
      "Each task is broken into structured prompts that return JSON. The AI model classifies, summarizes, generates, or reasons. Prompt engineering ensures reliable output schemas.",
    tags: ["Claude API", "Groq API", "Llama 3.3 70B", "JSON Prompting"],
  },
  {
    label: "Backend Services",
    sub: "Python · FastAPI",
    detail:
      "Python FastAPI handles business logic, data transformation, database operations, and custom integrations that n8n alone can't cover. Clean async endpoints.",
    tags: ["FastAPI", "Python", "Async", "Pydantic"],
  },
  {
    label: "Data Layer",
    sub: "PostgreSQL · SQLite",
    detail:
      "Persistent storage for conversation memory, appointment records, processed email logs, and system state. Simple schema design for fast iteration.",
    tags: ["PostgreSQL", "SQLite", "State Management"],
  },
];

const TIMELINE_ITEMS = [
  {
    date: "Phase 01",
    title: "Python Scripting Foundations",
    desc: "Learned Python from first principles — file I/O, data structures, APIs, and building small CLI utilities.",
  },
  {
    date: "Phase 02",
    title: "Automation Workflows",
    desc: "Built n8n-based pipelines, connected Gmail, Telegram, webhooks. Learned workflow design and failure handling.",
  },
  {
    date: "Phase 03",
    title: "AI System Integration",
    desc: "Integrated Claude and Groq APIs into workflows. Learned prompt engineering and structured output patterns.",
  },
  {
    date: "Phase 04",
    title: "Browser Automation",
    desc: "Mastered Playwright and Selenium — scraping, form filling, session handling, and bypass techniques.",
  },
  {
    date: "Phase 05 →",
    title: "Scalable AI Systems",
    desc: "Building production-oriented AI agents, FastAPI backends, and automation infrastructure for real clients.",
  },
];

const CASES = [
  {
    tag: "Problem",
    title: "Email Overload in SMBs",
    body: "Small businesses and solo operators receive hundreds of emails daily. Sorting, labeling, summarizing, and drafting replies manually consumes 1–2 hours every day — time that can't scale.",
    result:
      "Pipeline processes each email in under 10s on free-tier infrastructure.",
    detail: {
      challenge:
        "Building a reliable classification system that handles edge cases — forwarded emails, no-reply senders, multi-category messages — without false positives.",
      solution:
        "Structured JSON prompt engineering with Llama 3.3 70B via Groq. The model returns category, summary, extracted fields, and draft reply in a single call.",
      architecture:
        "Gmail Trigger → n8n → Groq API → Label Application → Draft Storage",
    },
  },
  {
    tag: "Problem",
    title: "Missed Appointments in Clinics",
    body: "Clinics running on manual WhatsApp/phone booking lose 3–5 patients per week to slow response times. One missed implant consultation = significant lost revenue.",
    result: "24/7 AI receptionist capturing leads even outside office hours.",
    detail: {
      challenge:
        "The AI must handle ambiguous language, track conversation context, check live availability, and escalate complex requests to a human — all reliably.",
      solution:
        "Claude-powered conversation engine with persistent memory, intent classification, and a structured booking FSM backed by FastAPI.",
      architecture:
        "Telegram → n8n → Claude API → FastAPI → PostgreSQL → Reminder Scheduler",
    },
  },
  {
    tag: "Problem",
    title: "Fragile Web Scraping Workflows",
    body: "Traditional web scraping requires custom code for every website. When site structures change, scripts break, leading to high maintenance costs and data gaps for businesses relying on web data.",
    result:
      "AI-driven extraction that adapts to layout changes automatically.",
    detail: {
      challenge:
        "Building a system that can understand intent from natural language and map it to dynamic web elements without manual selector mapping for every new site.",
      solution:
        "Hybrid extraction engine using LLMs for initial structure identification and cached CSS selectors for speed, with automatic fallback for complex sites.",
      architecture:
        "Natural Language Input → Playwright → Groq (Llama 3) → Dynamic Selector Engine → Railway",
    },
  },
];

function LoadingScreen({ done }) {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("Initializing systems...");
  useEffect(() => {
    const msgs = [
      "Initializing systems...",
      "Loading modules...",
      "Connecting pipelines...",
      "Connection established.",
    ];
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 30 + 10;
      if (p >= 100) p = 100;
      setProgress(p);
      setMsg(msgs[Math.min(Math.floor(p / 25), 3)]);
      if (p === 100) clearInterval(interval);
    }, 180);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={`loading-screen${done ? " done" : ""}`}>
      <div className="loading-logo">sys.build</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-text">{msg}</div>
    </div>
  );
}

function TerminalWidget() {
  const [lines, setLines] = useState([]);
  const [logSet, setLogSet] = useState(0);
  const bodyRef = useRef(null);
  useEffect(() => {
    let currentSet = 0;
    let lineIndex = 0;
    setLines([]);
    const addLine = () => {
      const set = TERMINAL_LOGS[currentSet];
      if (lineIndex < set.length) {
        setLines((prev) => [...prev, set[lineIndex]]);
        lineIndex++;
      } else {
        setTimeout(() => {
          currentSet = (currentSet + 1) % TERMINAL_LOGS.length;
          lineIndex = 0;
          setLogSet(currentSet);
          setLines([]);
        }, 2200);
      }
    };
    const interval = setInterval(addLine, 380);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (bodyRef.current)
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);
  const setLabels = [
    "// email_pipeline.log",
    "// clinic_bot.log",
    "// browser_engine.log",
  ];
  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="t-dot" style={{ background: "#ff5f57" }} />
        <div className="t-dot" style={{ background: "#ffbd2e" }} />
        <div className="t-dot" style={{ background: "#28ca41" }} />
        <span className="t-title">{setLabels[logSet]}</span>
      </div>
      <div
        className="terminal-body"
        ref={bodyRef}
        style={{ maxHeight: 300, overflowY: "auto" }}
      >
        {lines.map((l, i) => (
          <div className="t-line" key={i}>
            <span className="t-prefix">{">"}</span>
            <span className={`t-text ${l?.type || ""}`}>{l?.text}</span>
          </div>
        ))}
        <div className="t-line">
          <span className="t-prefix">{">"}</span>
          <span className="t-cursor" />
        </div>
      </div>
    </div>
  );
}

function FlowDiagram({ nodes }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % nodes.length), 1000);
    return () => clearInterval(t);
  }, [nodes.length]);
  return (
    <div className="flow-diagram">
      {nodes.map((n, i) => (
        <div key={i}>
          <div className={`flow-node${active === i ? " active" : ""}`}>{n}</div>
          {i < nodes.length - 1 && <div className="flow-arrow">↓</div>}
        </div>
      ))}
    </div>
  );
}

function ArchSection() {
  const [active, setActive] = useState(0);
  const node = ARCH_NODES[active];
  return (
    <section className="section arch-section fade-section">
      <div className="section-label">// architecture</div>
      <h2 className="section-h2">System Architecture</h2>
      <p className="section-sub">
        A layered infrastructure built for reliability, composability, and low
        operational cost.
      </p>
      <div className="arch-grid">
        <div className="arch-nodes">
          {ARCH_NODES.map((n, i) => (
            <div
              key={i}
              className={`arch-node${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              <div>
                <div className="arch-node-label">{n.label}</div>
                <div className="arch-node-sub">{n.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="arch-detail">
          <div className="arch-detail-title">{node.label}</div>
          <div className="arch-detail-desc">{node.detail}</div>
          <div className="arch-tags">
            {node.tags.map((t, i) => (
              <span className="arch-tag" key={i}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CaseCard({ c }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="case-card" onClick={() => setOpen((o) => !o)}>
      <div className="case-problem">{c.tag}</div>
      <div className="case-title">{c.title}</div>
      <div className="case-body">{c.body}</div>
      <div className="case-result">{c.result}</div>
      {open && (
        <div className="case-expanded">
          <div className="case-row">
            <span className="case-row-label">Challenge</span>
            <span className="case-row-val">{c.detail.challenge}</span>
          </div>
          <div className="case-row">
            <span className="case-row-label">Solution</span>
            <span className="case-row-val">{c.detail.solution}</span>
          </div>
          <div className="case-row">
            <span className="case-row-label">Stack</span>
            <span
              className="case-row-val"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "#00FF88",
              }}
            >
              {c.detail.architecture}
            </span>
          </div>
        </div>
      )}
      <div className="expand-indicator">
        {open ? "[ collapse ]" : "[ expand ]"}
      </div>
    </div>
  );
}

function ContactInput() {
  const [val, setVal] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="contact-terminal">
      {sent ? (
        <span style={{ color: "#00FF88" }}>
          ✓ Message queued. I'll respond within 24h.
        </span>
      ) : (
        <>
          <span style={{ color: "#00FF88" }}>{">"}</span>{" "}
          <input
            className="contact-input"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && val.trim()) setSent(true);
            }}
            placeholder="describe your automation need..."
          />
        </>
      )}
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const els = document.querySelectorAll(".fade-section");
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loaded]);
  const scroll = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <GlobalStyles />
      <LoadingScreen done={loaded} />
      <nav className="nav">
        <div className="nav-logo">{"{ sys.build }"}</div>
        <div className="nav-links">
          {["work", "architecture", "stack", "contact"].map((s) => (
            <button key={s} className="nav-link" onClick={() => scroll(s)}>
              {s}
            </button>
          ))}
        </div>
      </nav>
      <section className="hero" id="top">
        <div className="grid-bg" />
        <div
          className="glow-blob"
          style={{
            width: 500,
            height: 500,
            background: "#00FF88",
            left: -100,
            top: "20%",
          }}
        />
        <div className="hero-left">
          <div className="hero-badge">Available for freelance</div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              color: "var(--muted)",
              marginBottom: "0.5rem",
            }}
          >
            Hi, I'm
          </div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
              fontWeight: 800,
              color: "var(--accent)",
              marginBottom: "1rem",
              letterSpacing: "-0.01em",
            }}
          >
            <h1 style= {{ fontFamily: "var(--font-head)"}}> Md. Abu Tawsif </h1>
          </div>
          <h1 className="hero-h1">
            I build <span>automation</span>
            <br />
            systems that
            <br />
            replace repetitive work.
          </h1>
          <p className="hero-sub">
            Python · AI agents · n8n workflows · browser automation · API
            integrations. Systems that run while you sleep.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => scroll("work")}>
              View Projects
            </button>
            <button className="btn-ghost" onClick={() => scroll("contact")}>
              Contact Me
            </button>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src="/1000056406.jpg"
              alt="Md. Abu Tawsif"
              style={{
                width: 56,
                height: 56,
                borderRadius: "4px",
                objectFit: "cover",
                border: "1px solid rgba(0,255,136,0.3)",
              }}
            />
            <div>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Md. Abu Tawsif
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                }}
              >
                AI Automation Engineer
              </div>
            </div>
          </div>
          <TerminalWidget />
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "1.5rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#555",
            }}
          >
            {["Python", "n8n", "Claude API", "FastAPI", "Playwright"].map(
              (t) => (
                <span key={t}>{t}</span>
              )
            )}
          </div>
        </div>
      </section>
      <div className="divider" />
      <section className="section fade-section" id="services">
        <div className="section-label">// capabilities</div>
        <h2 className="section-h2">What I Build</h2>
        <p className="section-sub">
          Not apps. Operational systems. Automation infrastructure that
          eliminates human bottlenecks.
        </p>
        <div className="cards-grid">
          {[
            {
              icon: "🤖",
              title: "AI Automation",
              desc: "Intelligent workflows that classify, summarize, generate, and decide. Claude and Groq APIs integrated into production pipelines with structured JSON output schemas.",
            },
            {
              icon: "⚙️",
              title: "Python Systems",
              desc: "FastAPI backends, ETL scripts, API integrations, custom automation scripts. Clean code, async patterns, proper error handling — not tutorials, production work.",
            },
            {
              icon: "🌐",
              title: "Browser Automation",
              desc: "Playwright and Selenium workflows for data extraction, form submission, session management, and repetitive browser tasks. Reliable at scale.",
            },
          ].map((c, i) => (
            <div className="service-card" key={i}>
              <div className="card-icon">{c.icon}</div>
              <div className="card-title">{c.title}</div>
              <div className="card-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <div className="divider" />
      <section className="section fade-section" id="work">
        <div className="section-label">// featured projects</div>
        <h2 className="section-h2">Production Systems</h2>
        <p className="section-sub">
          Real-world automation built for operational value — not demo apps.
        </p>
        <div className="projects-list">
          <div className="project-card">
            <div className="project-num">PROJECT 01 — AI EMAIL AUTOMATION</div>
            <div className="project-inner">
              <div>
                <h3 className="project-h3">
                  Gmail AI
                  <br />
                  Processing System
                </h3>
                <p className="project-tagline">
                  Intelligent email management that categorizes, summarizes,
                  labels, and drafts replies automatically. Zero manual inbox
                  sorting. 10-second processing pipeline on free-tier
                  infrastructure.
                </p>
                <ul className="feat-list">
                  <li>Auto-categorizes into Urgent / Work / Invoice / Spam</li>
                  <li>Summarizes emails into actionable insights</li>
                  <li>Extracts deadlines and action items</li>
                  <li>Generates AI draft replies automatically</li>
                  <li>Applies Gmail labels and filters no-reply senders</li>
                </ul>
                <div className="stack-badges">
                  {[
                    "Python",
                    "n8n",
                    "Gmail API",
                    "Groq API",
                    "Llama 3.3 70B",
                    "OAuth2",
                  ].map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="project-btns">
                  <a className="btn-sm outline" href="#">
                    GitHub
                  </a>
                  <a className="btn-sm outline" href="#">
                    Case Study
                  </a>
                </div>
              </div>
              <div>
                <FlowDiagram
                  nodes={[
                    "Gmail Inbox",
                    "Email Trigger (60s)",
                    "AI Analysis Engine",
                    "Category Detection",
                    "Summary + Draft",
                    "Automatic Labeling",
                  ]}
                />
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "var(--accent-glow)",
                    borderLeft: "2px solid #00FF88",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#00FF88",
                  }}
                >
                  Saves professionals 1–2 hours daily
                </div>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-num">PROJECT 02 — AI CLINIC ASSISTANT</div>
            <div className="project-inner">
              <div>
                <h3 className="project-h3">
                  AI Clinic
                  <br />
                  Appointment Bot
                </h3>
                <p className="project-tagline">
                  An AI receptionist for medical and dental clinics. Responds to
                  patients on Telegram 24/7, qualifies leads, books
                  appointments, handles cancellations, and alerts admins when
                  human escalation is needed.
                </p>
                <ul className="feat-list">
                  <li>Instant patient response — 24/7 operation</li>
                  <li>Intent detection — booking, pricing, cancellation</li>
                  <li>Live availability checking + booking confirmation</li>
                  <li>Automated reminder scheduling</li>
                  <li>Admin escalation for complex queries</li>
                </ul>
                <div className="stack-badges">
                  {[
                    "Python",
                    "FastAPI",
                    "n8n",
                    "Claude AI",
                    "Telegram Bot API",
                    "PostgreSQL",
                  ].map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="project-btns">
                  <a className="btn-sm outline" href="#">
                    GitHub
                  </a>
                  <a className="btn-sm outline" href="#">
                    Case Study
                  </a>
                </div>
              </div>
              <div>
                <FlowDiagram
                  nodes={[
                    "Telegram Message",
                    "AI Conversation Engine",
                    "Intent Detection",
                    "Availability Check",
                    "Booking + Database",
                    "Reminder Scheduler",
                  ]}
                />
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "rgba(245,166,35,0.08)",
                    borderLeft: "2px solid #f5a623",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#f5a623",
                  }}
                >
                  One missed implant = hundreds lost. This pays for itself on
                  first lead captured.
                </div>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-num">PROJECT 03 — BROWSER AUTOMATION</div>
            <div className="project-inner">
              <div>
                <h3 className="project-h3">
                  Browser
                  <br />
                  Automation Engine
                </h3>
                <p className="project-tagline">
                  A modular Playwright-based automation framework for web
                  scraping, form submission, session handling, and repetitive
                  browser workflow execution at scale.
                </p>
                <ul className="feat-list">
                  <li>Multi-tab parallel execution</li>
                  <li>Session and cookie persistence</li>
                  <li>Structured data extraction to JSON/CSV</li>
                  <li>Screenshot and error capture</li>
                  <li>Proxy rotation support</li>
                </ul>
                <div className="stack-badges">
                  {[
                    "Python",
                    "Playwright",
                    "Selenium",
                    "Asyncio",
                    "FastAPI",
                  ].map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="project-btns">
                  <a className="btn-sm outline" href="#">
                    GitHub
                  </a>
                  <a className="btn-sm outline" href="#">
                    Case Study
                  </a>
                </div>
              </div>
              <div>
                <FlowDiagram
                  nodes={[
                    "Task Queue",
                    "Browser Instance Pool",
                    "Page Navigation",
                    "Data Extraction",
                    "Validation Layer",
                    "Output (JSON / CSV)",
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="project-num">PROJECT 04 — SCRAPERAI</div>
            <div className="project-inner">
              <div>
                <h3 className="project-h3">
                  ScraperAI — AI-Powered
                  <br />
                  Web Extraction Tool
                </h3>
                <p className="project-tagline">
                  A full-stack web scraping platform that uses AI to automatically extract structured data from any website. Describe what you want in plain English and the system figures out the rest.
                </p>
                <ul className="feat-list">
                  <li>Natural language task input — no code required</li>
                  <li>Intelligent structure caching — one LLM call per site</li>
                  <li>Hybrid extraction — CSS selectors with LLM fallback</li>
                  <li>URL pattern support for pagination and directories</li>
                  <li>Captcha and block detection with live data preview</li>
                </ul>
                <div className="stack-badges">
                  {[
                    "Python",
                    "FastAPI",
                    "Playwright",
                    "Groq API",
                    "Llama 3",
                    "Railway",
                  ].map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="project-btns">
                  <a className="btn-sm outline" href="https://github.com/taw-ssif26/scraper-project" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a className="btn-sm outline" href="https://scraper-project-seven.vercel.app/" target="_blank" rel="noreferrer">
                    Live Demo
                  </a>
                </div>
              </div>
              <div>
                <FlowDiagram
                  nodes={[
                    "User Input (English)",
                    "Browser Automation (Playwright)",
                    "LLM Structure Identification",
                    "CSS Selector Extraction",
                    "Data Table Preview",
                    "CSV/JSON Export",
                  ]}
                />
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "var(--accent-glow)",
                    borderLeft: "2px solid #00FF88",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "#00FF88",
                  }}
                >
                  Deployed on Railway with headless Chromium
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="divider" />
      <ArchSection />
      <div className="divider" />
      <section className="section fade-section" id="stack">
        <div className="section-label">// tech stack</div>
        <h2 className="section-h2">Command Center</h2>
        <p className="section-sub">
          Tools chosen for reliability, composability, and low maintenance
          overhead.
        </p>
        <div className="tech-grid">
          {[
            {
              cat: "Languages",
              items: [
                "Python 3.11+",
                "JavaScript",
                "TypeScript",
                "Bash / Shell",
              ],
            },
            {
              cat: "Automation",
              items: ["n8n", "Playwright", "Selenium", "Cron / Triggers"],
            },
            {
              cat: "AI / LLMs",
              items: [
                "Claude API",
                "Groq API",
                "Llama 3.3 70B",
                "Prompt Engineering",
              ],
            },
            {
              cat: "Backend",
              items: ["FastAPI", "Pydantic", "Asyncio", "Docker"],
            },
            {
              cat: "Databases",
              items: ["PostgreSQL", "SQLite", "Redis", "JSON Store"],
            },
          ].map((cat, i) => (
            <div className="tech-category" key={i}>
              <div className="tech-cat-label">{cat.cat}</div>
              {cat.items.map((item, j) => (
                <div className="tech-item" key={j}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <div className="divider" />
      <section
        className="section fade-section"
        id="journey"
        style={{ background: "var(--bg2)" }}
      >
        <div className="section-label">// journey</div>
        <h2 className="section-h2">Learning Path</h2>
        <p className="section-sub">
          Built through shipping, not through watching tutorials.
        </p>
        <div style={{ maxWidth: 600, marginTop: "1rem" }}>
          <div className="timeline">
            {TIMELINE_ITEMS.map((item, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-date">{item.date}</div>
                <div className="timeline-title">{item.title}</div>
                <div className="timeline-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="divider" />
      <section className="section fade-section" id="cases">
        <div className="section-label">// case studies</div>
        <h2 className="section-h2">Business Problems Solved</h2>
        <p className="section-sub">
          Automation that addresses real operational pain — click to expand each
          case.
        </p>
        <div className="case-grid">
          {CASES.map((c, i) => (
            <CaseCard c={c} key={i} />
          ))}
        </div>
      </section>
      <div className="divider" />
      <section className="section contact-section fade-section" id="contact">
        <div
          className="glow-blob"
          style={{
            width: 600,
            height: 600,
            background: "#00FF88",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div className="section-label" style={{ position: "relative" }}>
          // contact
        </div>
        <h2 className="contact-h" style={{ position: "relative" }}>
          Have a system
          <br />
          that <span>wastes time?</span>
        </h2>
        <p className="contact-sub" style={{ position: "relative" }}>
          Let's automate it.
        </p>
        <div className="contact-links" style={{ position: "relative" }}>
          {[
            { label: "Email", href: "mailto:taw.ssif26@gmail.com" },
            { label: "GitHub", href: "https://github.com/taw-ssif26" },
            {
              label: "LinkedIn",
              href: "https://linkedin.com/in/md-abu-tawsif-50826a3b7"
            },
            { label: "Telegram", href: "https://t.me/Tawssif26" },
            { label: "Facebook", href: "https://facebook.com/mdabu.tawsif.3" },
            { label: "Instagram", href: "https://instagram.com/taw_ssif" },
            { label: "YouTube", href: "https://youtube.com/@Md.AbuTawsif" },
{label: "Fiverr.", href:"https://fiverr.com/accounts/tawsif_mathology"}
          ].map((l) => (
            <a
              key={l.label}
              className="contact-link"
              href={l.href}
              target="_blank"
              rel="noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <ContactInput />
        </div>
      </section>
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "2rem 4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "#444",
        }}
      >
        <span>{"{ sys.build } — AI Automation Engineer"}</span>
        <span style={{ color: "#00FF88" }}>built with precision</span>
      </footer>
    </>
  );
}
