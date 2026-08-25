# Creative direction audit — Phase 10

Measured against the anti-pattern list in the brief. Re-run these checks before
any significant addition; the greps are cheap and they catch drift early.

## The AI-tell inventory

Counted across `components/` and `app/`:

| Pattern | Count | Note |
| --- | --- | --- |
| `rounded-*` | 0 | No rounded cards anywhere |
| `rounded-full` | 0 | No pill UI |
| `shadow-*` | 0 | Structure comes from hairlines and whitespace |
| `backdrop-blur` / `blur-*` | 0 | No glassmorphism |
| `animate-*` | 0 | No looping or ambient animation |
| `text-center` | 1 | The VR band on the home page — the single deliberate centred moment |
| Decorative gradients | 0 | The ten `gradient` hits are two conditional photo scrims, the placeholder weave, and the 3D canvas shadow |
| Three-card rows | 0 on real pages | Every `grid-cols-3` is in `/styleguide` |

Marketing register: **zero hits** across 24 banned terms (revolutionising,
cutting-edge, seamless, empower, unlock, elevate, world-class, leverage,
innovative, excellence, unparalleled, game-changing, holistic, synergy, and the
rest). No superlatives or unverifiable claims about the company.

## Typography

All nine steps of the scale are in use, in a healthy pyramid — 96 `text-meta`,
57 `text-small`, 51 `text-body`, 44 `text-lead`, down to **2 uses of
`text-display-xl`** (the home hero and the styleguide specimen). The largest size
is genuinely reserved for one line on one page, which is the point of having it.

## Composition

Home page section signatures were measured — tone, media count, grid column
spans, list presence, alignment. Result: **no two sections share a layout**, one
centred moment, one horizontal rail, and tones alternating
dark → base → light → base across fifteen sections.

**One fault found and fixed.** Sections 13 and 14 (Journal, Questions) were
structurally identical: `tone=base media=0 cols=[1:4 6:7] list=1`, twice in a
row — the exact sameness the page is built to avoid, and the kind of thing that
is invisible in code review. Questions was recomposed as a full-width heading
over a two-column index, which also suits eight short lines better than one
narrow column.

## Motion

85 `<Reveal>` usages, all one device: 16px, fires once, never replays.
Per page: 9–12 reveals on most pages, **60 on the home page** (15 sections).
That is the one figure worth watching — it is bounded and consistent rather than
runaway, but the home page is where over-animation would show first, and it
should be judged by eye before anything is added to it.

Every transition duration comes from a token — 56 uses, **zero ad-hoc
durations**.

## Spacing

Four tokens now cover vertical rhythm: `--spacing-section`,
`--spacing-section-lg`, `--spacing-block`, `--spacing-block-lg`. Before this pass
the inner rhythm was twelve repeated magic numbers (`py-14 lg:py-20` and
`py-16 lg:py-24`), consistent in effect but with no signal to a developer about
which to use. They are now fluid rather than jumping at the `lg` breakpoint.

**Zero ad-hoc section padding remains.**

## Accessibility and SEO

22/22 routes clean: one `h1` each, no skipped heading levels, canonical, OG and
Twitter tags, valid JSON-LD, `lang="en-IN"`, no unlabelled fields, no images
without alt, no links or buttons without accessible names, correct 404.

Contrast: 30 distinct foreground/background pairs on the home page, **zero
failures**. The lowest is 4.65:1 on a 40px numeral, where the threshold is 3:1.

## What this audit cannot tell you

Everything above is structural. It establishes that the site is not built from
the patterns that make a page look generated, and that its composition varies
where it should.

It says nothing about whether the site *looks good*. Proportion, crop, the weight
of the type against the images, whether the whitespace reads as confident or
merely empty — none of that is measurable, and none of it has been seen. The
build environment does not composite frames, so no page in this project has ever
been looked at.

Before launch, someone has to open it and judge it. In particular:

- The home page at desktop width, scrolled slowly end to end
- The 3D builder — geometry proportions especially
- The 360° viewer — orientation and hotspot placement
- Any page once real photography replaces the 24 placeholders, which will change
  the character of the site more than any code change in it
