PartKasa Client Web – Frontend Notes

What’s improved
- Route-level code splitting using React.lazy + Suspense in `src/App.js` for faster initial loads.
- Global ErrorBoundary wrapping routed content in `components/layout/Layout.js` to prevent white screens and improve resilience.
- Accessible skip link and better semantics in `Layout`.
- SEO defaults in `public/index.html` and per-page titles/descriptions via a lightweight `useSEO` hook.
- Sentry ready: initialize via `REACT_APP_SENTRY_DSN` and error capture wired in `ErrorBoundary`.
- Basic PWA: custom `public/sw.js` registered in production for offline navigation and asset caching.
- Basic tests: smoke test for layout and an accessibility test for the skip link under `src/__tests__`.

What to install (run in partkasa/client-web)
- npm install (to add Sentry):
  - `npm install @sentry/react`
- Optional (recommended): add Sentry for monitoring, axe for a11y testing, and a bundle analyzer.

Next steps to reach “world‑class”
- Observability: integrate Sentry (errors + performance) and connect request IDs from API Gateway.
  - Set `REACT_APP_SENTRY_DSN` in `partkasa/.env`.
  - Optionally enable performance and session replay once DSN is live.
- Performance: image optimization (responsive srcset), prefetch critical routes, analyze bundles.
- PWA: service worker + offline cache for search/results and product pages.
- Security: tighten CORS in API Gateway, ensure httpOnly cookies for auth, consider CSRF protections if using cookies.
- Accessibility: add automated a11y checks (axe) in CI, aim WCAG 2.1 AA.
- SEO: dynamic Open Graph tags per product/results; consider SSR/SSG.
- Framework: consider migrating to Next.js for SSR/SSG, built-in image optimization, and file-based routing.

How to run locally
- `npm start` – dev server
- `npm test` – run unit/integration tests

PWA notes
- Service worker only registers in production builds. Run `npm run build` then serve `build/` to test.
- After updates to `sw.js`, users may need to hard-refresh to pick up changes.
