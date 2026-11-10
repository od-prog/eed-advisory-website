# EED Advisory website prototype

This repository contains the EED Advisory website and its Payload CMS. The current homepage is a prototype: its visual identity and all homepage copy are proposals for EED review, not approved brand guidance or organizational claims. The neutral E mark and icon are temporary. See [the visual direction note](docs/eed-visual-direction.md).

The site supports English and German routes. The CMS provides localized page content, preview, editorial pages, and published insight posts. The homepage uses the existing motion foundation and remains readable without JavaScript or when reduced motion is enabled.

## Local development

1. Install dependencies from the repository root with `pnpm install`.
2. Copy `web/.env.example` to `web/.env` and set local `WEBSITE_URL`, `CMS_URL`, and `VERCEL_ENV` values.
3. Copy `cms/.env.example` to `cms/.env` and configure Payload, the database, and required integrations.
4. Start the CMS and web apps in separate terminals with `pnpm --filter cms dev` and `pnpm --filter web dev`.

Set `PUBLIC_CONTACT_URL` and `PUBLIC_ANALYTICS_DOMAIN` only after EED confirms the values. Social links are intentionally empty until approved. Production website and CMS URLs, the media storage origin, CMS frame-ancestors policy, and email sender also require deployment-specific values.

Media routing uses `PUBLIC_MEDIA_ORIGIN`; it has no default host, and Vercel production configuration fails unless it is set to the approved public bucket or CDN origin. S3 CORS is generated from `S3_CORS_ALLOWED_ORIGIN` with `node cms/scripts/print-s3-cors.mjs`; set it to the exact browser origin that opens the Payload admin and uploads files. The command prints a bucket-ready policy allowing `PUT` and exits with an error when the value is missing or malformed. Confirm the actual CMS deployment origin before applying that policy.

The CMS seed creates only a bilingual homepage draft and required interface labels. It does not add sample people, projects, or insight posts. The homepage displays insight cards only when editors publish real posts.

## Browser checks

Run the motion and homepage browser suites with `pnpm test:e2e`. Install Chromium with `pnpm exec playwright install chromium`. Playwright starts Astro with test-only environment values and does not require a running CMS. Development-only fixtures return 404 in production.

## Current scope

- Sprint 1.1 motion foundation is complete on `main`.
- Sprint 2 establishes a reviewable visual direction and homepage prototype.
- Projects, Publications, programme content, geographic relationships, and expanded CMS editorial workflows remain deferred to Sprint 3.
