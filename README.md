# AI Foundry (Next.js)

## Run locally
    cp .env.example .env.local     # set ADMIN_PASSWORD and AUTH_SECRET (openssl rand -hex 32)
    npm install && npm run dev     # http://localhost:3000, admin at /admin
Locally, content saves to data/content.json. No database needed.

## Deploy (Vercel + Neon)
1. Push to GitHub, import in Vercel.
2. Create a free Neon project, copy its connection string into DATABASE_URL. The table is created automatically.
3. Add ADMIN_PASSWORD, AUTH_SECRET, BREVO_API_KEY, CONTACT_FROM (a sender verified in Brevo), CONTACT_TO.
4. Open /admin, log in, edit, press SAVE.

## Security notes
- /admin is not linked anywhere, is blocked in robots.txt and marked noindex. The real protection is the server-side login: an httpOnly signed cookie, 7-day expiry, and every save re-checked on the server.
- Login attempts are limited per instance only. Use a long passphrase.
- Photos are stored as data URLs in the database. Fine for one portrait; move to Vercel Blob if you add many images.
