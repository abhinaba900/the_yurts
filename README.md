# theyurts.in

Next.js 16 · React 19 · Tailwind v4 · TypeScript

```bash
npm run dev          # http://localhost:3000
npm run build
npm run typecheck
npm run content:todo # regenerate docs/CONTENT-NEEDED.md from the media manifest
```

`/styleguide` renders the entire design system. It is the reference — if a page
needs something that is not on that route, add it to the system first.

## Architecture

```
app/
  styles/tokens.css    design tokens — the only place colour, type and motion are defined
  styles/base.css      element defaults, grid, container, reduced-motion rules
  styleguide/          the living design system
components/primitives/ Button, ArrowLink, Field, Media, Metadata, Reveal, Rule, Section
data/media.ts          every image on the site, declared once
lib/                   fonts, motion constants, cn()
docs/                  build plan + generated client asset list
```

## Content (Sanity)

The Studio is served from the site itself at `/studio` — one URL, one login, no
separately deployed admin. Copy `.env.example` to `.env.local` and fill in
`NEXT_PUBLIC_SANITY_PROJECT_ID` to connect it; `/studio` explains the steps until
you do.

**The site runs without a CMS.** Every query goes through `sanityFetch`, which
returns the caller's fallback when Sanity is unconfigured, unreachable, or
errors — it never throws. An unconfigured project and an empty dataset are the
same situation to a page, and every section is already built to hide itself when
it has no content. This is verified: `next build` completes with all pages static
even when pointed at a project id that does not exist.

**Import boundary.** Pages import from `sanity/lib/content.ts` and nowhere else.
That module owns each query, its TypeScript type, its cache tags and its empty
value together, so a page cannot fetch untagged, untyped, or without a fallback.

**Types.** `sanity/lib/types.ts` is hand-written to match the projections in
`queries.ts` line for line. Change a projection and the type must change with it
— that mismatch surfaces as a type error rather than as `undefined` in
production. Almost every field is optional on purpose: content arrives
incomplete, and optional types are what force templates to handle that.

**Cache invalidation.** Publishing in the Studio calls `/api/revalidate`, which
verifies the webhook signature and expires only the tags for the document that
changed. The site updates in seconds with no rebuild and without putting the
Sanity API in front of visitors. Setup instructions are in the route file.

**Personal data.** `enquiry` documents hold names, emails and phone numbers. They
are read by no public query, excluded from the sitemap, and the dataset must be
private.

**Editor guardrails in the schema.** Alt text is required on every image, so it
can never be retrofitted. The rich-text style list only offers what the design
system actually renders. `project.published` defaults to off, and `faq.answer` is
required — a question with no answer is created by not creating it.

## Rules

**Colour.** Components use semantic tokens only — `surface`, `text`, `text-muted`,
`accent`, `accent-text`, `line`, `line-strong`. Never `bg-clay` or `text-ink`
directly. Semantic tokens are re-declared by `[data-tone="dark"]`, so wrapping a
section in `<Section tone="dark">` flips everything inside with no extra classes.

These must be **real declarations**, not `var()` indirection through another
custom property — a property that references another resolves once, where it is
declared, so a descendant redefining the referenced variable would have no effect.

**Type.** Two faces. Instrument Serif for display, Inter for everything else.
Metadata is the third voice: `text-meta`, uppercase, tracked. Specifications are
set as typography (`24 FT`, `452 SQ FT`), not stacked into cards.

**Adding a token.** Add it to `tokens.css` *and* to the class group list in
`lib/cn.ts` — tailwind-merge cannot distinguish a custom font-size from a custom
text colour and will silently drop one of them otherwise.

**Structure.** One hairline weight, from `border-line`. No card borders, no
shadows, no radii, no gradients. Structure comes from rules and whitespace.

**Motion.** Three durations, three curves, all in `lib/motion.ts` mirroring
`tokens.css`. Reveals fire once and travel at most 16px. Nothing loops. Never
branch on `useReducedMotion()` for rendering — it resolves differently on server
and client and every reveal will hydrate mismatched. Reduced motion is handled by
the `[data-reveal]` `!important` rule in `base.css` and by `<MotionProvider>`.

**Images.** Never inline an `<img>` or `next/image`. Declare the asset in
`data/media.ts` and render `<Media id="..." />`. Until an entry has a `src` it
renders a designed placeholder naming the file it is waiting for, in the crop the
layout has already reserved — so real photography drops in with no layout shift
and no page edits.

**Shell.** `Header`, `Footer`, `SkipLink` and `SmoothScroll` are rendered once in
the root layout. The header is fixed; `<main>` carries a top offset for it, and a
page opening with a full-bleed hero cancels that with `-mt-20 md:-mt-24`.

**Header tone over a hero.** A hero section marks itself `data-header-tone="dark"`.
Two mechanisms read it, and both are needed:

- CSS (`tokens.css`) matches `body:has(main > [data-header-tone="dark"]:first-child)
  header[data-scrolled="false"]`, so a page that *opens* dark is correct on the
  first painted frame — before any JavaScript has run.
- The header also samples what is behind it on scroll, which covers dark sections
  further down the page. It uses `elementsFromPoint` (plural) and skips its own
  subtree: the header is fixed over that point, so the singular
  `elementFromPoint` only ever returns the header itself.

**Routes.** Every navigation destination exists, so nothing 404s and every URL has
a real title, description and canonical from day one. Unbuilt pages render
`PageStub`, which states plainly that the page is in development rather than
imitating content. `scripts/gen-stubs.py` generated them and can be deleted once
they are all replaced.

**SEO.** Pages never hand-roll metadata — they call `pageMetadata()` in `lib/seo.ts`,
which owns canonicals, Open Graph and Twitter cards. Structured data omits any
field the client has not supplied; an incomplete `Organization` block is fine, an
invented one is not.

**Smooth scroll.** Lenis, wheel only. Native scrolling is left alone on touch, and
the whole thing is skipped under `prefers-reduced-motion` — smoothed scrolling is
a vestibular trigger, not a decoration.

**Home page rhythm.** `components/home/` holds one file per section, composed in
order by `app/page.tsx`. No two consecutive sections share a layout, a surface or
an alignment — that alternation is the design, not an accident of authoring. The
page has exactly one centred moment (the VR band) and exactly one horizontal
scroll (the range rail); both work because they are the only one of their kind.
Check the composition before inserting anything between two existing sections.

**Empty states are designed, not hidden badly.** There are no articles, no
completed projects and no published FAQ answers yet, so those sections show what
they will cover and say plainly that they are not filled in. What they do not do
is render placeholder article cards or invented project names.

**CMS-or-fallback pages.** `/yurts` and `/applications` render CMS documents when
they exist and a written static set from `data/` when they do not. The fallbacks
are the categories and uses the client named in their brief — carrying no
specifications, sizes or prices, because none have been supplied. This means all
eleven application pages are real, indexable URLs from launch, and each is
replaced silently by its CMS version at the same URL. `generateStaticParams`
unions both sources, and so does the sitemap.

**Detail templates.** `/yurts/[slug]` is one template for every yurt, and every
block below the title is conditional. A product published with only a name and a
paragraph renders a shorter page — no empty headings, no "TBC" rows, nothing an
editor feels obliged to fill with a guess. Product and FAQPage schema are emitted
from whatever is actually present; `offers` is deliberately absent because there
is no published pricing.

**Structured data is never written ahead of the content.** `/faq` publishes its
questions grouped by topic while the answers are being written, but emits
FAQPage schema *only* once real answers exist in the CMS — marking up questions
that open onto nothing would be a structured-data lie. The same rule governs
Product schema (no `offers`, because there is no pricing) and project
testimonials (rendered only when there is a real quote).

**The Journal is an edited publication, not a feed.** The most recent article
takes a full-width landscape crop and display-large type; everything after it is
a hairline row with a small portrait. That difference in weight is what stops the
index reading as a grid of cards. Categories are real indexable URLs at
`/journal/category/[slug]` rather than a client-side filter, because those are
the pages that rank.

**Client boundaries stay small.** The FAQ is a server component; the client
boundary exists only for the search field, and expansion is a native `<details>`
element that works before hydration and is findable by the browser's own in-page
search. Portable Text answers are rendered on the server and passed down as
nodes, so the renderer never crosses into the client bundle.

**The 3D builder is parametric, not a loaded model.** `YurtModel` builds the
lattice, roof poles and crown from radius and wall height, so changing size
rebuilds a structurally correct yurt rather than scaling a mesh. The cutaway uses
`thetaLength` on the cover geometry to open a wedge over a frame that is really
modelled underneath. To swap in client assets, replace that one component with a
GLTF loader and map `RenderSpec` onto its materials — nothing outside
`components/builder/` knows how the yurt is drawn.

**Sizes in the configurator carry no dimensions.** They are Compact, Standard,
Large and Grand. Publishing "5m · 19.6 sq m · sleeps 4" would be inventing a
specification, so the builder lets someone explore proportion and finish without
asserting a figure the workshop has not confirmed — and the interface says so.

**Three.js never reaches the rest of the site.** The builder is loaded through
`next/dynamic` with `ssr: false` behind a skeleton laid out like the finished
page. Verified: no chunk on the home page contains the WebGL renderer. The scene
runs `frameloop="demand"` — it renders on change and is otherwise fully idle —
and has no HDR, no texture files and no external asset of any kind. Lighting is
three lights and a painted shadow.

**Canvas sizing is owned, not delegated.** React Three Fiber measures itself with
a ResizeObserver whose initial observation cannot be relied on to fire; when it
does not, the canvas sits at 300x150 with nothing drawn until the window is
resized. `BuilderCanvas` measures the container itself and, if the renderer has
not taken that size, dispatches a bounded, self-cancelling series of resize
events. Where the observer behaves, the first check passes and it does nothing.

**The 360° viewer works before the photography exists.** Each scene in
`data/vr.ts` renders a generated reference panorama — horizon, yaw and pitch
grid, degree labels, and the filename it is waiting for — so navigation,
hotspots and controls are all testable now. Setting `src` on a scene swaps in the
real capture; nothing else changes. A capture that fails to load falls back to
the same grid rather than a black sphere.

**Angle conventions live in `lib/vr.ts`**, outside the React tree so they can be
tested directly: forward is −Z, yaw is degrees clockwise from above, pitch is
degrees above the horizon. Hotspots in the scene data are authored in exactly
those terms. Yaw damping crosses the ±180° seam by the short way.

**Every viewpoint is a real button.** The canvas is `aria-hidden` and its hotspots
are pointer targets, so the viewpoint list in the chrome is the accessible route
to the same navigation — nothing is reachable only by aiming at a ring in a
photograph. A drag that happens to end over a hotspot is treated as a look, not a
click.

**`SizedCanvas` is shared by both 3D features.** It owns canvas measurement
because React Three Fiber's own ResizeObserver cannot be relied on to fire its
initial observation — see the comment in the file for the full failure mode.

**The enquiry form never lies about delivery.** `submitEnquiry` reports success
only when the enquiry actually landed somewhere a human will see it — a Sanity
`enquiry` document, a notification email, or both. If both are configured and
both fail, it says so and keeps the form filled in. If neither is configured — the
state this site is in until `SANITY_API_WRITE_TOKEN` or the Resend variables are
set — it says that plainly and tells the visitor to get in touch another way. A
form that thanks someone while dropping their message is worse than no form,
because they stop looking for another route and the lead disappears without trace.

**Forms work without JavaScript.** A plain `<form>` with a server action, rendered
as a real `method="POST"`. `useActionState` adds pending state and inline errors
on top; it is not what makes it work. Context — a builder configuration, a
product, a gated resource — arrives as query parameters, is read on the server and
written into hidden fields, so it survives a no-JS submission. Validation is
server-side regardless of what the browser did.

**Spam handling** is a honeypot field plus server-side length caps on every input.
Bots that fill the hidden field get a success page rather than a hint they were
caught.

**Motion is CSS, not a library.** Scroll reveals are an IntersectionObserver
adding one class, with the transition defined in `base.css`. This replaced an
animation library that cost 44kb gzipped on every page of the site to move things
16px — measure with `npm run payload` before adding anything comparable back. The
hidden state is gated on `.js` and has a 1.5s backstop, so content can never be
stranded invisible if the observer fails.

**Measure, do not guess.** `npm run payload` reports gzipped JS per route against
a running production build. At the end of Phase 9 every route ships ~197-200kb
gzipped, most of which is the React and Next runtime floor; three.js is absent
from everything except the two routes that lazy-load it.

**Accessibility-critical CSS is written out, not composed.** The skip link had a
dozen `focus:` utilities fighting `not-sr-only`, and background and padding
silently lost on source order — invisible in review, broken in use. It is now one
explicit rule in `base.css`. Prefer that for anything where losing a declaration
is a functional failure rather than a cosmetic one.

**Palette: walnut and emerald, dark-dominant.** The default tone in
`tokens.css` is the dark ground; `[data-tone="light"]` is the pale punctuation
between dark passages. Flipping those two blocks inverts the entire site — no
component knows which tone it is in.

Emerald is 2.97:1 on walnut. It **fails as text and always will at that value**,
so it does structural work — fills, rules, decorative marks — and gold (8.26:1)
carries every typographic accent. If you reach for emerald on small type on a
dark surface, that is the bug.

**Scroll-driven motion is native CSS, gated on `.sda`.** Not `@supports`:
Lightning CSS does not recognise `animation-timeline`, evaluates the condition as
permanently false, and strips the entire block from the build. The boot script
does a real `CSS.supports` check and adds a class, which the compiler cannot
second-guess. Cost of the whole motion layer: **+1kb gzipped**.

**The pinned rail** on the home page is a sticky section whose track translates
on a `view-timeline`, with each card entering on its own slice of that timeline.
No scroll listener and no JavaScript in the component at all, so it tracks a
trackpad, a wheel, a scrollbar drag and a keyboard PageDown identically, and
reverses correctly on the way back up. Below `lg`, and under reduced motion, it
is an ordinary swipe rail.

**Responsiveness is height-aware, not just width-aware.** A landscape phone at
844x390 is past the `lg` breakpoint and shorter than a phone is tall, so width
alone describes it wrongly. Three variants in `globals.css` handle it:

- `tall:` — minimum heights only apply where there is room. The hero used to
  force `min-h-[32rem]` (512px) onto a 390px screen.
- `short:` — for anything that needs to shrink on a short screen.
- `landscape-split:` — wide enough to split, too short to stack. The 3D builder
  and the VR viewer use it to put the stage beside the controls instead of
  above them, which takes the builder canvas from 829x203 to 481x310.

The pinned rail asks for both: `(width >= 64rem) and (height >= 40rem)`. Width
alone would pin it on a landscape phone, where a portrait card is 659px tall
inside a 390px pin.

**Tap targets** use `.u-tap`, which grows the hit area to the 24px minimum and
cancels the growth with an equal negative margin, so no surrounding rhythm
moves. Padding alone would push the layout around.

**Content.** Nothing is invented. No testimonials, projects, clients,
certifications, awards, statistics, specifications, pricing or years of
experience. Sections without real content are hidden, not filled. No stock
photography standing in for the company's own work.
