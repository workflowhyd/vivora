# Vivora Foods

Marketing site for **Vivora Foods** — premium dry fruits, nuts and
dehydrated snacks. *Dry Delicious. Nature Goodness.*

Built with [Next.js](https://nextjs.org) (App Router), Tailwind CSS v4,
[Motion](https://motion.dev) for animation, and [Convex](https://convex.dev)
(with [Convex Auth](https://labs.convex.dev/auth)) as the backend for the
product catalogue, categories, incoming quote requests, and the `/admin`
panel. Deployed as a standard Next.js server app (e.g. Vercel) — not a
static export.

## Getting started

Requires two things running at once during local dev: the Convex backend
and the Next.js dev server.

```bash
npm install

# Terminal 1 — logs you into Convex (first run only), provisions a
# deployment, writes NEXT_PUBLIC_CONVEX_URL to .env.local, and pushes
# convex/ functions/schema. Leave this running.
npx convex dev

# Terminal 2 — wires up Convex Auth's signing keys on the deployment
# (only needs to be run once, after the first `npx convex dev`).
npx @convex-dev/auth

# Terminal 2 again — seeds the products/categories tables from the
# site's original static content. Safe to re-run (no-ops once seeded).
npx convex run seed:run

# Terminal 2 — start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for
the admin panel — use the "Create an account" link there once to create
your own admin login (there's no public sign-up link on the site itself).

## Project structure

- `app/` — routes, layout, metadata, sitemap/robots, and `app/admin/**`
  (the admin panel: products, categories, inquiries, protected by
  `middleware.ts` + Convex Auth)
- `components/` — public site page sections (Hero, About, ProductShowcase,
  CTA — the "Request a Quote" form, etc.)
- `convex/` — schema, queries/mutations (`products.ts`, `categories.ts`,
  `inquiries.ts`), auth config (`auth.ts`), and the one-time `seed.ts`
- `data/` — remaining static content (nav links, About/Hero copy, Quality
  pillars, Process steps, Applications, Statistics, Global Reach) and the
  shared image URL constants. Products and categories used to live here too
  but now live in Convex — see `convex/seed.ts` for the original data.
- `lib/` — small shared utilities

## Admin panel

`/admin` manages **products**, **categories**, and **inquiries** (quote
requests submitted through the site's contact form). Any account created
via `/admin/login` counts as an admin — there are no separate roles, since
this is a single-tenant internal tool. All other site copy (Hero, About,
Quality, etc.) is still edited directly in `data/content.ts`.

## Build

```bash
npm run build
```

Note: this requires `convex/_generated/` to exist, which is only created
by running `npx convex dev` at least once.
