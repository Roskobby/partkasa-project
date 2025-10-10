PartKasa Next.js Web (SSR Scaffold)

Purpose
- SSR/SEO-optimized frontend scaffold using Next.js 14 App Router + Tailwind.
- Mirrors key routes from the SPA for gradual migration.

Setup
1) cd partkasa/next-web
2) npm install
3) Create .env.local with:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

4) npm run dev

Notes
- Tailwind is configured; global styles in src/styles/globals.css.
- Images are configured to allow localhost and any https domain (adjust in next.config.js).
- Use src/lib/api.js for Axios configured to your API.
- Start migrating pages incrementally; enable dynamic metadata per route as needed.

