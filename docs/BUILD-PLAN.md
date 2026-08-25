# theyurts.in — Build Plan

**Status:** All ten phases complete. See docs/CREATIVE-DIRECTION-AUDIT.md and docs/CONTENT-NEEDED.md. Design system, shell, home, content model, core pages, Journal, gallery, FAQ and resources built. Sanity project not yet created — set NEXT_PUBLIC_SANITY_PROJECT_ID to connect one.

Remaining: nothing in the build plan. Blocked on client assets and credentials — see below.
**Last updated:** 2026-08-24

## Locked decisions

| Decision | Choice |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind v4 over hand-authored CSS-variable token layer. No UI component library. |
| CMS | Sanity, studio embedded at `/studio` |
| Imagery | Designed placeholders only until client assets arrive. No stock, no fake projects. |
| 3D / VR | Built after the core site (Phases 6–7), core site shippable without them |
| 3D stack | React Three Fiber + drei, GLTF/Draco, lazy route |
| VR stack | three.js equirect sphere + WebXR, config-driven scenes |
| Motion | Motion (framer-motion) + Lenis, all gated on `prefers-reduced-motion` |
| Forms | Server actions → Resend email + Sanity `enquiry` document |
| Hosting | Vercel |

## Hard content rules
No invented testimonials, projects, clients, certifications, awards, statistics, specs, pricing,
or years of experience. Sections with no real content are hidden, not filled. Every placeholder is
logged in `docs/CONTENT-NEEDED.md` with its target filename and aspect ratio.

---

## Phase 0 — Foundation & design system ✅
- Repo scaffold, TS/lint/format, folder architecture (`app/`, `components/`, `lib/`, `sanity/`, `data/`)
- Colour tokens: charcoal, bone, canvas, clay, timber, moss, sand — CSS custom properties, single source
- Type system: Instrument Serif (display) + Inter (UI), fluid clamp scale, uppercase metadata style
- Grid (12-col + break-out), spacing scale, image ratios (3:4, 4:5, 16:9, 21:9, full-bleed)
- Primitives: Button, ArrowLink, Field, Divider, Metadata, Figure, MediaPlaceholder, RevealText, RevealImage
- Motion rules (durations, easings, reduced-motion guard)
- **Exit criteria:** `/styleguide` route renders the full system and is approved before page work begins

## Phase 1 — Shell & navigation ✅
- Scroll-aware minimal header; fullscreen mobile nav with staggered reveal
- Editorial footer, page transition layer, smooth scroll, media cursor states
- SEO infrastructure: metadata factory, OG image route, sitemap, robots, canonical,
  Organization + LocalBusiness + Breadcrumb schema

## Phase 2 — Home ✅
Cinematic hero → intro → what is a yurt (drawn diagram) → why yurts → product showcase
(horizontal scroll) → applications (editorial list) → 3D builder teaser → VR teaser →
build process → materials → sustainability → gallery → journal → FAQ → enquiry.
**Every section a different composition.** No repeated 3-card blocks.

## Phase 3 — Content model + Sanity Studio ✅
Schemas: product, productCategory, application, project, post, author, faq, resource,
enquiry, siteSettings, configuratorOption.
Embedded studio, clean desk structure, image hotspot, portable text with image/video/pull-quote.
Typed GROQ queries; empty states hide sections.

## Phase 4 — Core pages ✅
Products index + dynamic `[slug]` detail template (gallery, specs, floor plans, materials,
downloads, FAQ, quote CTA, Product schema) · Applications index + `[slug]` · About ·
Build Process (01–08 vertical narrative) · Why Theyurts · Glamping Business landing page

## Phase 5 — Journal, gallery, FAQ, resources ✅
Editorial journal index (varied entry sizes, not a grid) · article template with reading time,
related posts, Article schema, share · Gallery/Inspirations on the `project` schema so it
upgrades to Case Studies later · searchable categorised FAQ with FAQPage schema ·
resources with optional gated download

## Phase 6 — 3D yurt builder ✅
Lazy route, progressive load, designed loading state. Option groups from a config file
(size, exterior, roof, doors, windows, flooring, interior package, furniture). Material/geometry
swaps on a placeholder GLTF. Summary → "REQUEST THIS CONFIGURATION" posts config into enquiry.
Mobile: full-height canvas + bottom option sheet.

## Phase 7 — VR experience ✅
360 viewer, hotspot viewpoint navigation, fullscreen, WebXR where supported, gyro on mobile.
Scenes defined in one config file for easy asset swap.

## Phase 8 — Conversion layer ✅
General enquiry, request a quote, product enquiry, consultation booking, WhatsApp CTA,
contact page with map. Server actions, validation, real success/error states.

## Phase 9 — Performance, accessibility, SEO audit ✅
LCP/CLS budget, image sizes audit, bundle split check, Lighthouse ≥95 mobile, keyboard nav,
contrast, focus states, reduced-motion pass, structured data validation.

## Phase 10 — Creative director pass ✅
Visual audit against the anti-AI checklist. Fix by removing: tighter type, more whitespace,
better crops, less motion. Never by adding components. Finalise `docs/CONTENT-NEEDED.md`.

---

## Blocked on the client

Nothing further can be built without these.

| Needed | Unblocks |
| --- | --- |
| Sanity project id | `/studio`, all CMS content |
| `SANITY_API_WRITE_TOKEN` (or Resend keys) | The enquiry form — it currently refuses to claim success |
| 24 photographs (docs/CONTENT-NEEDED.md) | Every image placeholder |
| 360° captures | The VR viewer's reference grids |
| Product specifications | Sizes, materials, technical data |
| Contact details | Phone, email, WhatsApp, workshop address |
| Company/team information | The About page's empty states |

## Open decisions

- **Lenis smooth scroll** costs 14kb gzipped and hijacks native scrolling. A
  design choice, left in place rather than removed unilaterally.
- **No rate limiting** on the enquiry endpoint. The honeypot stops naive bots; a
  determined submitter could flood it. Needs a WAF or equivalent at the edge.
- **Sanity dataset must be private** before launch — `enquiry` documents hold
  personal data.
