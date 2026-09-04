# Rafiq Sons Labels, website

A premium single-page brand experience for Rafiq Sons Labels, built from the real Instagram
feed of @rafiqsonslabelss. Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion,
GSAP ScrollTrigger, Lenis smooth scrolling, and a Neon Postgres database.

## Run it

```bash
npm install
npm run dev     # development on http://localhost:3000
npm run build   # production build
npm run start   # production server
```

Environment variables live in `.env.local` (never commit this file):

```
APIFY_TOKEN=...               # only used once, to pull the Instagram feed
DATABASE_URL=...              # Neon Postgres connection string
OPENROUTER_API_KEY=...        # optional, reserved for future AI imagery
NEXT_PUBLIC_INSTAGRAM_URL=...
ADMIN_PASSWORD=...            # password for /admin
NEXT_PUBLIC_SITE_URL=...      # https://your-domain.com in production
```

## Admin panel, no code needed

Open `/admin` and sign in with `ADMIN_PASSWORD`.

- Enquiries: every quote request and contact form, with status tracking (new, replied, quoted, won, lost).
- Products: names, descriptions, detail lines and guide prices. Amber badges mark values that were guessed and need confirmation.
- Homepage text: hero headline, intro paragraph, phone, WhatsApp, email and location.
- Reviews: replace the sample reviews with real customer quotes.
- FAQs: edit, add or remove questions.

Saved changes appear on the website immediately.

## Database

Tables (`leads`, `orders`, `products`, `categories`, `testimonials`, `site_content`)
are created automatically on first request. The quote form writes to `leads` and `orders`.
Admin edits are stored as overrides in `site_content` and merged over the default content
in `src/content/site.ts`.

## Media

- `public/photos`: curated and optimized Instagram photography (75 images, watermarked areas cropped out).
- `public/videos`: four compressed reels (cropped, 720p, no audio) used in the hero and reel row.
- `public/ai`: three AI-generated textures (weave, atelier, satin) used as section backgrounds.

## SEO

Metadata, Open Graph, Twitter cards, JSON-LD Organization and WebSite schema,
`sitemap.xml`, `robots.txt`, semantic HTML, descriptive alt text on every image.
