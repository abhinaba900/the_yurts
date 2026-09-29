# Theyurts — Project Overview

A quick orientation for developers joining the project. For the full rules, read [README.md](../README.md).

## What is it?

**Theyurts** (theyurts.in) is the marketing website for an Indian company that
designs, manufactures and installs **premium yurts** for resorts, glamping sites,
wellness retreats, farm stays and private landowners.

The site's job is to:

- Show the yurt range, specs, materials and the build process
- Show uses (resorts, glamping, etc.) and past projects
- Let visitors **design a yurt in 3D** (configurator) and **walk through one in 360° / VR**
- Collect **enquiries** (leads) from interested buyers
- Publish a **journal** (blog), FAQ and resources

## Tech stack

| Area | Tool |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 + design tokens in `app/styles/tokens.css` |
| CMS | Sanity, embedded in the site at `/studio` |
| 3D / VR | three.js, React Three Fiber, drei, @react-three/xr |
| Motion | Lenis smooth scroll, reveal animations (`lib/motion.ts`) |
| Email | Resend (optional, for enquiry notifications) |

## Folder map

```
app/(site)/        All public pages (home, yurts, applications, projects, journal,
                   experiences/builder, experiences/vr, enquire, faq, about, ...)
app/studio/        Sanity Studio (CMS admin) at /studio
app/actions/       Server action for the enquiry form
app/api/revalidate Sanity webhook -> refreshes cached pages on publish
components/        UI, grouped by area (home, builder, vr, site, primitives, ...)
data/              Local fallback content (products, FAQ, media list, VR scenes, ...)
lib/               Helpers: site config, SEO, configurator logic, email, motion
sanity/            CMS schemas, queries, types, fetch client
scripts/           Content / media / bundle-size utility scripts
docs/              Build plan, content still needed from the client, audits
```

## Key things to know

1. **Works without the CMS.** If Sanity is not configured, pages fall back to the
   data in `data/` and empty sections hide themselves. You can run it with no `.env`.
2. **Pages fetch content only via `sanity/lib/content.ts`.**
3. **Images:** never use `<img>` directly. Register the image in `data/media.ts`
   and render `<Media id="..." />`. Missing images show a labelled placeholder.
4. **Design system:** use semantic colour tokens only (`surface`, `text`, `accent`, ...).
   No shadows, rounded corners or gradients. See the live reference at `/styleguide`.
5. **Company facts** (phone, email, address) live only in `lib/site.ts`. Unknown
   values stay `null`. Don't invent them.
6. **Enquiry form** only reports success if the lead was actually saved to Sanity
   or emailed. Otherwise it shows an error on purpose.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — fill in Sanity / Resend keys
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run typecheck`, `npm run content:todo`,
`npm run verify:media`, `npm run payload` (per-route JS size).

## Current status

The build plan is complete. The site is waiting on **client assets and credentials**
(real photos, 3D model, Sanity project, contact details). See
[docs/CONTENT-NEEDED.md](CONTENT-NEEDED.md) and [docs/BUILD-PLAN.md](BUILD-PLAN.md).
