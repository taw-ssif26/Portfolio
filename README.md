# Md Abu Tawsif — Portfolio

A CMS-driven personal portfolio built like a research-facility interface: boot sequence, targeting cursor, day/night environments, a project observatory and per-project "expedition" pages. All content is edited from a built-in admin dashboard. No code changes are needed for content updates.

**Stack:** Clash Display + Satoshi (Fontshare) + Geist Mono · Next.js 15 (App Router) · React 19 · TypeScript · Drizzle ORM · Neon Postgres · Vercel Blob · Brevo · Zod · jose (JWT) · argon2

**Running cost:** $0 on free tiers.

---

## Table of contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Project structure](#project-structure)
4. [Environment variables](#environment-variables)
5. [Local setup](#local-setup)
6. [Using the admin dashboard](#using-the-admin-dashboard)
7. [API reference](#api-reference)
8. [Data model](#data-model)
9. [Deployment (Vercel)](#deployment-vercel)
10. [Security](#security)
11. [Known limitations](#known-limitations)
12. [Roadmap](#roadmap)
13. [Troubleshooting](#troubleshooting)

---

## Features

**Public site (multi-page)**
- Routes: `/` (System), `/work`, `/work/[slug]` (project expedition), `/lab`, `/about`, `/contact`
- Colour-wipe transitions between pages; boot sequence once per session
- Three environments from the switch: **Day** (warm paper, cobalt/coral/emerald/amber/orchid), **Night** (deep ink, cyan/magenta/lime/amber/violet, drifting aurora), **Field** (a pseudo-3D laboratory corridor you walk down by scrolling)
- Every project gets its own hue and an animated generated visual by `visualType`: flow, conversation, sensor, geometry, architecture, default
- Effects: scramble-decode name, gradient hero type, split-word heading reveals, 3D card tilt with glare, magnetic buttons, cursor spotlight, targeting cursor, live HUD, scrolling marquee
- Field mode: ceiling lights, wall spectrum panels, tumbling wireframes, speed streaks, scanner frame, target lock on hovered projects, scanlines and viewport brackets
- Reduced motion respected; responsive; SEO metadata from settings

**Admin dashboard (`/admin`)**
- Create, edit, delete and reorder: projects, project media, lab entries, skills, skill links, experience, social links
- Image upload to Vercel Blob
- Site settings editor (name, descriptors, bio, focus, SEO)
- Public pages update on save with no redeploy

## Architecture

```
Visitor ──► Next.js (Vercel, cached pages, tag revalidation) ──┐
                                                               ├──► Neon Postgres (Drizzle)
Admin ───► /admin (JWT cookie, middleware-protected) ──► API ──┤
                                                               ├──► Vercel Blob (images)
Contact form ──► /api/contact ──► Postgres ──► Brevo (email) ──┘
```

**Caching model:** public reads use `unstable_cache` with tags (`projects`, `settings`, `lab`, `skills`, `social`). Every admin write calls `revalidateTag()`. Pages also revalidate every 300 seconds as a safety net.

**Auth model:** one admin. Credentials are checked against `ADMIN_EMAIL` and an argon2 hash in env. A successful login sets a 7-day, httpOnly, SameSite=Strict JWT cookie. Middleware (edge) verifies the JWT on `/admin/*` and `/api/admin/*`.

**Generic CRUD:** `/api/admin/[resource]` is driven by a single map in `src/lib/resources.ts`. Adding an editable table is one line there plus one entry in the admin UI config.

## Project structure

```
.
├── drizzle.config.ts            # Drizzle Kit config
├── next.config.ts
├── scripts/
│   └── hash-password.ts         # npm run hash -- "password"
└── src/
    ├── middleware.ts            # protects /admin and /api/admin
    ├── db/
    │   ├── schema.ts            # all tables and enums
    │   └── index.ts             # Neon HTTP client
    ├── lib/
    │   ├── auth.ts              # credentials check, JWT session
    │   ├── content.ts           # cached public readers
    │   ├── resources.ts         # resource map + column whitelist
    │   └── rate-limit.ts        # in-memory limiter
    ├── components/
    │   ├── Boot.tsx             # boot sequence
    │   ├── Nav.tsx, ProjectTile.tsx, Motif.tsx, Split.tsx, PageHead.tsx, PageNext.tsx, Footer.tsx, Marquee.tsx
    │   ├── FieldCanvas.tsx      # lattice / Field-mode flow field
    │   ├── Fx.tsx               # reveals + system-shift transition
    │   ├── Scramble.tsx, Hud.tsx, Stage.tsx
    │   ├── Cursor.tsx           # targeting cursor
    │   ├── ContactForm.tsx      # animated contact pipeline
    │   └── ThemeToggle.tsx
    └── app/
        ├── layout.tsx           # fonts, theme init, metadata
        ├── page.tsx             # home
        ├── globals.css          # themes + all styles
        ├── projects/[slug]/     # project expedition
        ├── admin/               # login + dashboard UI
        └── api/
            ├── contact/
            └── admin/           # login, [resource], reorder, settings, upload
```

## Environment variables

| Variable | Purpose | Where to get it |
|---|---|---|
| `DATABASE_URL` | Postgres connection (**pooled**, host contains `-pooler`) | Neon → Connect |
| `ADMIN_EMAIL` | Admin login email | You choose |
| `ADMIN_PASSWORD_HASH` | argon2 hash of the admin password | `npm run hash -- "password"` |
| `JWT_SECRET` | Signs session tokens | `openssl rand -base64 32` |
| `BREVO_API_KEY` | Sends contact emails | Brevo → SMTP & API → API Keys |
| `BREVO_SENDER_EMAIL` | From address (must be a verified Brevo sender) | Brevo → Senders |
| `CONTACT_TO_EMAIL` | Inbox for contact messages | You choose |
| `BLOB_READ_WRITE_TOKEN` | Image uploads | Vercel → Storage → Blob |

> **`$` escaping:** in `.env.local` only, write every `$` in the hash as `\$`. In Vercel, paste the hash raw.

## Local setup

Requirements: Node 20+, a Neon database.

```bash
npm install
cp .env.example .env.local        # fill in values

# Run migrations (use the DIRECT Neon string, not the pooled one)
DATABASE_URL="<direct-connection-string>" npm run db:generate
DATABASE_URL="<direct-connection-string>" npm run db:migrate

npm run dev                       # http://localhost:3000
```

| Script | Action |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `start` | Production build / server |
| `npm run db:generate` | Generate SQL migration from `schema.ts` |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Browse the database in Drizzle Studio |
| `npm run hash -- "pw"` | Generate `ADMIN_PASSWORD_HASH` |

After changing `schema.ts`, run `db:generate` then `db:migrate`.

## Using the admin dashboard

Open `/admin/login`.

**Create a project:** Projects → **+ New** → fill the fields → tick `published` → Save.

**Architecture JSON** (drives the animated flow on the project page):
```json
[
  { "id": "ui",  "label": "Next.js" },
  { "id": "api", "label": "FastAPI", "note": "auth + job queue" },
  { "id": "db",  "label": "PostgreSQL" }
]
```

**Metrics JSON:**
```json
[{ "label": "Users", "value": "120" }, { "label": "Uptime", "value": "99.9%" }]
```

**Add screenshots:** Project media → **+ New** → set `projectId` (the project's id), upload an image, add alt text, Save.

**Reorder:** use the ↑ ↓ buttons in the list. Order is reflected on the public site.

**Site settings:** values are JSON, so text needs quotes.

| Key | Example |
|---|---|
| `hero.name` | `"MD ABU TAWSIF"` |
| `hero.descriptors` | `["AI SYSTEMS","AUTOMATION","SOFTWARE"]` |
| `about.bio` | `"I build systems that turn complicated processes into something that simply works."` |
| `about.focus` | `["AI","AUTOMATION","SYSTEM DESIGN"]` |
| `seo.title` / `seo.description` | `"..."` |

## API reference

All `/api/admin/*` routes require the admin cookie (otherwise `401`).

| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/login` | `{email, password}` → sets session cookie. Rate limited. |
| GET | `/api/admin/{resource}` | List rows (ordered by `sortOrder` or `id`) |
| POST | `/api/admin/{resource}` | Create a row |
| PATCH | `/api/admin/{resource}/{id}` | Update a row |
| DELETE | `/api/admin/{resource}/{id}` | Delete a row |
| POST | `/api/admin/reorder` | `{resource, ids:[...]}` sets order |
| GET / PUT | `/api/admin/settings` | Read all / upsert `{key, value}` |
| POST | `/api/admin/upload` | multipart `file` → `{url}` (images, max 4MB) |
| POST | `/api/contact` | Public. `{name, email, message}`. Rate limited, honeypot protected. |

`{resource}` ∈ `projects`, `project-media`, `skills`, `skill-links`, `lab`, `experience`, `social`.

Quick test:
```bash
curl -c jar.txt -X POST localhost:3000/api/admin/login \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","password":"your-password"}'

curl -b jar.txt localhost:3000/api/admin/projects
curl -i localhost:3000/api/admin/projects        # expect 401
```

## Data model

| Table | Purpose |
|---|---|
| `projects` | Name, slug, category, problem/solution/implementation/result, `architecture` and `metrics` (JSONB), status, visual type, URLs, featured, published, order |
| `project_media` | Images/videos per project |
| `skills` | Technologies, grouped |
| `skill_links` | Edges between skills (for the planned tech map) |
| `project_skills` | Which skills a project uses (planned filter feature) |
| `lab_entries` | Experiments, notes, prototypes |
| `experience` | Work and education |
| `social_links` | Footer links |
| `site_settings` | Key/value JSONB for all editable site text |
| `contact_messages` | Every contact submission, with an `emailed` flag |

Project status values: `live`, `beta`, `in_development`, `prototype`, `archived`.

## Deployment (Vercel)

1. Create the Neon project (region **Singapore**) and run migrations (see [Local setup](#local-setup)).
2. In Brevo, verify your sender email and create an API key.
3. Push the repo to GitHub and import it into Vercel.
4. Add all environment variables except `BLOB_READ_WRITE_TOKEN`. Paste `ADMIN_PASSWORD_HASH` **raw**.
5. Deploy, then **Storage → Create → Blob**, connect it, and **redeploy**.
6. **Settings → Functions → Region:** `sin1` (match Neon).
7. Scope secrets to **Production** only, or give previews a separate Neon branch.

**Verify:**
- [ ] `/admin` redirects to login when logged out
- [ ] `curl -i https://<domain>/api/admin/projects` → `401`
- [ ] Image upload works
- [ ] Admin edits appear on the public site without a redeploy
- [ ] Contact form delivers an email

## Security

- Admin routes are protected by edge middleware, and the API whitelists writable columns.
- Passwords are hashed with argon2id, and login uses constant-work checking.
- Session cookie: `httpOnly`, `SameSite=Strict`, `Secure` in production, 7-day expiry.
- Login is limited to 5 attempts per 15 minutes per IP, and the contact form to 3 per 10 minutes.
- The contact form has a honeypot field, and messages are stored before any email is attempted.
- Never commit `.env*`. If a secret leaks, rotate it: delete and regenerate the Brevo key, reset the Neon role password, change `JWT_SECRET` (which logs you out).

## Known limitations

- **Rate limiter is in-memory:** it resets per serverless instance. Move to Upstash Redis if you see abuse.
- **Uploads:** images only, max 4MB (Vercel's request body limit). For video, paste a hosted URL.
- **Generic admin API** validates column names, not value types per table. It's safe for a single trusted admin only.
- **Reorder is not atomic:** a mid-way failure leaves a partial order that can be redone.
- **Neon cold start:** about 500ms on the first query after idle, hidden by caching for visitors.
- **Vercel Hobby** is non-commercial. If the site advertises paid work, check Vercel's terms or host elsewhere.

## Roadmap

- [ ] Tech map with relationships and click-to-filter projects (needs a `project_skills` admin UI)
- [ ] Per-project visual identities (`visualType` is stored but not yet rendered)
- [ ] Lab simulations
- [ ] Client-side Blob upload for video
- [ ] Experience/education rendering on the public site
- [ ] Analytics (Vercel Analytics or Plausible)

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Login returns 401 with the correct password | `$` not escaped in `.env.local`, or `ADMIN_EMAIL` mismatch |
| 500 on pages or API | Migrations not run, or `DATABASE_URL` wrong |
| Homepage empty after publishing | `published` not ticked, or wait for the 5-minute revalidate |
| Upload fails | No Blob store connected, or no redeploy after connecting |
| Contact saved but no email | Brevo sender unverified or wrong API key (check Vercel function logs) |
| Emails land in spam | Free-provider sender via Brevo fails DMARC. Verify your own domain in Brevo |
| Build fails on fonts | Network blocked to Google Fonts (Geist Mono). Build where it's reachable |
| Headlines show a fallback font | Fontshare CDN blocked (ad-blocker or offline). Fonts load at runtime from api.fontshare.com |

---

Built by Md Abu Tawsif.
