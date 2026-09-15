# Vivora Foods

Marketing site and B2B product catalogue for **Vivora Foods** — premium
dehydrated vegetables, fruits, powders and ready-to-cook products.
*Dry Delicious. Nature Goodness.*

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

# Terminal 2 again — seeds the products/categories tables with the
# dehydrated-food catalogue. Safe to re-run (no-ops once seeded).
npx convex run seed:run

# Terminal 2 — start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for
the admin panel.

### ⚠️ One-time schema migration step (existing deployments only)

The `products`/`categories` tables were reshaped for the new catalogue
(categories are now a real relation via `categoryId`, products support image
galleries, pack sizes, specs, etc.). If your Convex deployment already has
data from the old dry-fruit/nuts catalogue, **clear both the `products` and
`categories` tables** via the Convex dashboard's "Clear table" action before
running `npx convex dev` against the new `convex/schema.ts` — otherwise the
push will fail schema validation against the old-shaped rows. Do this once
per environment (dev, and any preview/prod deployment). A brand new Convex
project needs no such step.

### Admin access

Admin sign-in is restricted to an email allowlist — see
`convex/adminAllowlist.ts`. Add teammate emails to `ADMIN_EMAILS` there (and
redeploy Convex functions) before they can sign up or sign in at
`/admin/login`; anyone else attempting to sign up is rejected server-side.

## Project structure

- `app/` — routes, layout, metadata, sitemap/robots, the public catalogue
  (`/products`, `/products/[slug]`, `/categories/[slug]`), and `app/admin/**`
  (the admin panel: products, categories, inquiries, protected by
  `middleware.ts` + Convex Auth + the email allowlist)
- `components/` — public site page sections (Hero, About, CTA — the
  "Request a Quote" form, etc.) and `components/products/` (ProductCard,
  ProductGrid, ProductFilters, CategoryCard, ProductGallery, the catalogue
  and featured-products sections)
- `convex/` — schema, queries/mutations (`products.ts`, `categories.ts`,
  `inquiries.ts`), auth config (`auth.ts`), the admin allowlist
  (`adminAllowlist.ts`, `lib/authz.ts`), the one-time `seed.ts`, and its
  placeholder catalogue content in `seedData/`
- `data/` — remaining static marketing content (nav links, Applications,
  Process, Quality, Statistics, Global Reach) and shared image URL constants
  for those sections. Product/category content lives in Convex — see
  `convex/seedData/` for the seed content.
- `lib/` — small shared utilities

## Admin panel

`/admin` manages **products**, **categories**, and **inquiries** (quote
requests submitted through the site's contact form). Sign-up/sign-in is
gated by the email allowlist in `convex/adminAllowlist.ts` — there are no
separate roles beyond that, since this is a single-tenant internal tool.
All other site copy (Hero, About, Quality, etc.) is still edited directly
in `data/content.ts`.

## Build

```bash
npm run build
```

Note: this requires `convex/_generated/` to exist, which is only created
by running `npx convex dev` at least once.
