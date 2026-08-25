import type { Metadata as NextMetadata } from "next";
import { Metadata } from "@/components/primitives/Metadata";
import { Rule } from "@/components/primitives/Rule";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/primitives/Button";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Media } from "@/components/primitives/Media";
import { TextField, TextArea, SelectField } from "@/components/primitives/Field";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/Reveal";

export const metadata: NextMetadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/* -------------------------------------------------------------------------- */

function Spec({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="u-container border-t border-line py-16 md:py-24">
      <div className="u-grid">
        <header className="col-span-4 mb-10 md:col-span-6 lg:col-span-3 lg:mb-0">
          <div className="lg:sticky lg:top-16">
            <Metadata className="text-accent-text">{index}</Metadata>
            <h2 className="mt-3 font-display text-display-sm">{title}</h2>
            {note ? (
              <p className="mt-4 u-measure-tight font-sans text-small text-text-muted">
                {note}
              </p>
            ) : null}
          </div>
        </header>
        <div className="col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-5">
          {children}
        </div>
      </div>
    </section>
  );
}

function Swatch({
  name,
  token,
  hex,
  use,
  border,
}: {
  name: string;
  token: string;
  hex: string;
  use: string;
  border?: boolean;
}) {
  return (
    <div>
      <div
        className={border ? "h-24 w-full border border-line" : "h-24 w-full"}
        style={{ backgroundColor: hex }}
      />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-sans text-small text-text">{name}</span>
        <span className="font-sans text-meta uppercase text-text-muted">
          {hex}
        </span>
      </div>
      <p className="mt-1 font-sans text-meta uppercase text-text-muted opacity-70">
        {token}
      </p>
      <p className="mt-2 u-measure-tight font-sans text-small text-text-muted">
        {use}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export default function StyleguidePage() {
  return (
    <div>
      {/* ---- MASTHEAD ---- */}
      <header className="u-container pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="u-grid">
          <div className="col-span-4 md:col-span-6 lg:col-span-9">
            <Metadata>Theyurts &mdash; Phase 00</Metadata>
            <h1 className="mt-6 font-display text-display-lg u-optical-left">
              The design system.
            </h1>
            <p className="mt-8 u-measure font-sans text-lead text-text-muted">
              Two typefaces, one palette, one grid, one hairline, one reveal.
              Every page in the site is assembled from what is on this page. If
              something cannot be built from these parts, the system is wrong
              &mdash; not the page.
            </p>
          </div>
          <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-2 lg:col-start-11 lg:mt-0">
            <dl className="space-y-4">
              {[
                ["Display", "Instrument Serif"],
                ["Text", "Inter"],
                ["Grid", "12 / 6 / 4"],
                ["Tone", "Light + Dark"],
              ].map(([k, v]) => (
                <div key={k} className="border-t border-line pt-2">
                  <dt className="font-sans text-meta uppercase text-text-muted">
                    {k}
                  </dt>
                  <dd className="mt-1 font-sans text-small">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* ---- 01 COLOUR ---- */}
      <Spec
        index="01"
        title="Colour"
        note="Earth, timber, canvas, stone. Nothing saturated. Clay is the only accent and it is rationed — rules, numerals and live states, never a background."
      >
        <Metadata className="mb-6">Paper</Metadata>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <Swatch
            name="Bone"
            token="--color-bone"
            hex="#F4F1EA"
            border
            use="Default page surface. Warm paper, never white."
          />
          <Swatch
            name="Canvas"
            token="--color-canvas"
            hex="#EAE5DA"
            use="Alternate sections. A half-step down, not a grey band."
          />
          <Swatch
            name="Sand"
            token="--color-sand"
            hex="#DBD2C1"
            use="Recessed surfaces, image placeholders, spec tables."
          />
        </div>

        <Metadata className="mt-16 mb-6">Earth</Metadata>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <Swatch
            name="Stone"
            token="--color-stone"
            hex="#B4AB9A"
            use="Hairlines only. Never text — 2.02:1 on bone."
          />
          <Swatch
            name="Stone deep"
            token="--color-stone-deep"
            hex="#5C5647"
            use="Strong hairlines and secondary marks. 6.47:1."
          />
          <Swatch
            name="Timber"
            token="--color-timber"
            hex="#8A6A4B"
            use="Diagrams and material references. Large text only."
          />
          <Swatch
            name="Timber deep"
            token="--color-timber-deep"
            hex="#6B5138"
            use="Timber at text weight. 6.51:1 on bone."
          />
          <Swatch
            name="Moss"
            token="--color-moss"
            hex="#4A5442"
            use="Landscape and sustainability contexts. 7.06:1."
          />
        </div>

        <Metadata className="mt-16 mb-6">Accent &mdash; clay</Metadata>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <Swatch
            name="Clay"
            token="--color-clay"
            hex="#A8552F"
            use="Rules, numerals, hover states. Decorative use."
          />
          <Swatch
            name="Clay deep"
            token="--color-clay-deep"
            hex="#8E4526"
            use="Accent at text weight on light. 6.15:1."
          />
          <Swatch
            name="Clay light"
            token="--color-clay-light"
            hex="#D69A72"
            use="Accent at text weight on night. 7.57:1."
          />
        </div>

        <Metadata className="mt-16 mb-6">Ink</Metadata>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3">
          <Swatch
            name="Ink"
            token="--color-ink"
            hex="#221F1A"
            use="All body and display text on light. 14.56:1."
          />
          <Swatch
            name="Ink muted"
            token="--color-ink-muted"
            hex="#585245"
            use="Secondary copy and metadata. Clears AA on bone, canvas and sand."
          />
          <Swatch
            name="Night"
            token="--color-night"
            hex="#171512"
            use="Dark section surface. Warm black, not neutral."
          />
        </div>

        <div className="mt-16 border-t border-line pt-6">
          <p className="u-measure font-sans text-small text-text-muted">
            Components never reference the palette above directly. They use
            semantic tokens &mdash;{" "}
            <code className="text-accent-text">surface</code>,{" "}
            <code className="text-accent-text">text</code>,{" "}
            <code className="text-accent-text">line</code>,{" "}
            <code className="text-accent-text">accent</code> &mdash; which are
            re-mapped by{" "}
            <code className="text-accent-text">data-tone=&quot;dark&quot;</code>.
            Swapping the brand palette is a change to one file.
          </p>
        </div>
      </Spec>

      {/* ---- 02 TYPOGRAPHY ---- */}
      <Spec
        index="02"
        title="Typography"
        note="Instrument Serif for every display line. Inter for everything a reader has to work through. Metadata is the third voice — small, uppercase, widely tracked."
      >
        <div className="space-y-14">
          {[
            [
              "Display XL",
              "text-display-xl",
              "Hero lines. One per page.",
              "A room without walls.",
            ],
            [
              "Display LG",
              "text-display-lg",
              "Section openers.",
              "Built for the landscape.",
            ],
            [
              "Display MD",
              "text-display-md",
              "Sub-sections and pull quotes.",
              "Designed for living.",
            ],
            [
              "Display SM",
              "text-display-sm",
              "Card and list headings.",
              "The Resort Yurt",
            ],
          ].map(([label, cls, use, sample]) => (
            <div key={label} className="border-t border-line pt-5">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Metadata>{label}</Metadata>
                <span className="font-sans text-meta uppercase text-text-muted opacity-70">
                  {use}
                </span>
              </div>
              <p className={`font-display ${cls} u-optical-left`}>{sample}</p>
            </div>
          ))}

          <div className="border-t border-line pt-5">
            <Metadata className="mb-4">Numeral</Metadata>
            <div className="flex flex-wrap items-baseline gap-x-12 gap-y-6">
              {[
                ["24", "FT DIAMETER"],
                ["452", "SQ FT"],
                ["6–8", "GUESTS"],
              ].map(([n, l]) => (
                <div key={l}>
                  <span className="font-display text-numeral">{n}</span>
                  <span className="ml-3 font-sans text-meta uppercase text-text-muted">
                    {l}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 u-measure font-sans text-small text-text-muted">
              Specifications are set as typography, not stacked into cards. This
              is the primary device for presenting product data.
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <Metadata className="mb-4">Lead</Metadata>
            <p className="u-measure font-sans text-lead">
              A yurt is a circular frame of timber lattice under a tensioned
              canvas skin, held in compression by a crown wheel. It has been
              built this way for a very long time, and it works.
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <Metadata className="mb-4">Body</Metadata>
            <p className="u-measure font-sans text-body text-text-muted">
              Body copy sits at a 34em measure and 1.65 line height. Long-form
              article text uses the same setting &mdash; the Journal is not a
              separate typographic system, it is this one at a longer length.
              Anything that needs to be read carefully is set in Inter; anything
              that needs to be felt is set in Instrument Serif.
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <Metadata className="mb-4">Metadata</Metadata>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Metadata>Resort Yurt</Metadata>
              <Metadata>Nashik, Maharashtra</Metadata>
              <Metadata>Six minute read</Metadata>
              <Metadata className="text-accent-text">01 &mdash; Design</Metadata>
            </div>
          </div>
        </div>
      </Spec>

      {/* ---- 03 GRID ---- */}
      <Spec
        index="03"
        title="Grid"
        note="Twelve columns on desktop, six on tablet, four on mobile. Layouts are asymmetric by default — full-width symmetrical blocks are the exception, not the baseline."
      >
        <div className="u-grid mb-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`h-28 bg-surface-deep ${i >= 4 ? "hidden md:block" : ""} ${i >= 6 ? "md:hidden lg:block" : ""}`}
            >
              <span className="block p-2 font-sans text-meta uppercase text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
        <dl className="grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4">
          {[
            ["Mobile", "4 col"],
            ["≥ 768px", "6 col"],
            ["≥ 1024px", "12 col"],
            ["Max width", "96rem"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-sans text-meta uppercase text-text-muted">
                {k}
              </dt>
              <dd className="mt-1 font-sans text-small">{v}</dd>
            </div>
          ))}
        </dl>
      </Spec>

      {/* ---- 04 IMAGERY ---- */}
      <Spec
        index="04"
        title="Imagery"
        note="Photography is the primary design element, so the crop is decided by the layout — not by whatever arrives. Until real assets exist every image renders as a designed placeholder naming the file it is waiting for."
      >
        <div className="space-y-8">
          <Media
            id="styleguide.ratio-cinema"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
          <div className="grid gap-8 md:grid-cols-2">
            <Media
              id="styleguide.ratio-editorial"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <Media
              id="styleguide.ratio-portrait"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </div>
          <Media
            id="styleguide.ratio-landscape"
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
        </div>
        <p className="mt-8 u-measure font-sans text-small text-text-muted">
          Every image is declared once in{" "}
          <code className="text-accent-text">data/media.ts</code> with its
          filename, crop, alt text and art direction. Setting{" "}
          <code className="text-accent-text">src</code> on an entry swaps the
          placeholder for the real photograph &mdash; no page is edited and
          nothing shifts, because the crop was reserved from the start.
        </p>
      </Spec>

      {/* ---- 05 ACTIONS ---- */}
      <Spec
        index="05"
        title="Actions"
        note="A hairline that fills, an ink block, and a rule that draws itself. Nothing is pill-shaped, nothing has a shadow, nothing has a gradient."
      >
        <div className="space-y-12">
          <div>
            <Metadata className="mb-5">Primary</Metadata>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="solid">Request a quote</Button>
              <Button variant="solid" size="sm">
                Download brochure
              </Button>
            </div>
          </div>
          <div className="border-t border-line pt-8">
            <Metadata className="mb-5">Secondary</Metadata>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="hairline">Book a consultation</Button>
              <Button variant="hairline" size="sm">
                Explore the builder
              </Button>
            </div>
          </div>
          <div className="border-t border-line pt-8">
            <Metadata className="mb-5">Inline &mdash; the site default</Metadata>
            <div className="flex flex-col items-start gap-5">
              <ArrowLink href="/styleguide">View all yurts</ArrowLink>
              <ArrowLink href="/styleguide" external>
                Enquire
              </ArrowLink>
            </div>
          </div>
        </div>
      </Spec>

      {/* ---- 06 FORMS ---- */}
      <Spec
        index="06"
        title="Forms"
        note="Fields are hairlines, not boxes. The rule turns clay on focus. An enquiry should read like a letter, not a checkout."
      >
        <form className="grid gap-x-8 gap-y-10 md:grid-cols-2">
          <TextField id="sg-name" label="Name" placeholder="Your full name" />
          <TextField
            id="sg-email"
            label="Email"
            type="email"
            placeholder="you@company.com"
          />
          <SelectField id="sg-interest" label="Interest">
            <option>Resort or hotel</option>
            <option>Glamping site</option>
            <option>Farm stay</option>
            <option>Wellness retreat</option>
            <option>Private residence</option>
          </SelectField>
          <TextField
            id="sg-location"
            label="Site location"
            optional
            placeholder="District, state"
          />
          <TextArea
            id="sg-message"
            label="About the project"
            className="md:col-span-2"
            placeholder="Land, access, how many structures, rough timeline."
            hint="Anything you already know helps. Nothing here is required."
          />
          <TextField
            id="sg-error"
            label="Error state"
            className="md:col-span-2"
            defaultValue="not-an-email"
            error="Enter an email address we can reply to."
          />
          <div className="md:col-span-2">
            <Button variant="solid" type="button">
              Send enquiry
            </Button>
          </div>
        </form>
      </Spec>

      {/* ---- 07 RULES ---- */}
      <Spec
        index="07"
        title="Rules &amp; indices"
        note="One hairline weight across the whole site. Structure comes from rules and whitespace — never from a border drawn around a card."
      >
        <div className="space-y-6">
          <Rule />
          <Rule index="01" label="Design" />
          <Rule index="02" label="Material selection" />
          <Rule index="03" label="Manufacturing" />
        </div>
      </Spec>

      {/* ---- 08 MOTION ---- */}
      <Spec
        index="08"
        title="Motion"
        note="Three durations, three curves. Reveals fire once, travel 16px, and never loop. Under prefers-reduced-motion every animation collapses to its final state."
      >
        <div className="space-y-10">
          <Reveal kind="up" className="border-t border-line pt-5">
            <Metadata className="mb-3">Reveal &mdash; up &middot; 450ms</Metadata>
            <p className="font-display text-display-sm">
              Text and small blocks. The default.
            </p>
          </Reveal>

          <Reveal kind="media" className="border-t border-line pt-5">
            <Metadata className="mb-3">
              Reveal &mdash; media &middot; 900ms
            </Metadata>
            <p className="font-display text-display-sm">
              Photography uncovers rather than fades.
            </p>
          </Reveal>

          <div className="border-t border-line pt-5">
            <Metadata className="mb-3">Stagger &middot; 60ms</Metadata>
            <RevealGroup className="space-y-2">
              {["Resorts", "Glamping", "Farm stays", "Wellness retreats"].map(
                (t, i) => (
                  <RevealItem key={t} index={i}>
                    <p className="font-display text-display-sm">{t}</p>
                  </RevealItem>
                ),
              )}
            </RevealGroup>
          </div>

          <dl className="grid grid-cols-3 gap-6 border-t border-line pt-6">
            {[
              ["Quick", "200ms", "Hover, focus, colour"],
              ["Base", "450ms", "Reveals, transitions"],
              ["Slow", "900ms", "Media, page transitions"],
            ].map(([k, v, u]) => (
              <div key={k}>
                <dt className="font-sans text-meta uppercase text-text-muted">
                  {k}
                </dt>
                <dd className="mt-1 font-display text-display-sm">{v}</dd>
                <p className="mt-1 font-sans text-small text-text-muted">{u}</p>
              </div>
            ))}
          </dl>
        </div>
      </Spec>

      {/* ---- 09 DARK TONE ---- */}
      <Section tone="dark" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-3">
              <Metadata className="text-accent-text">09</Metadata>
              <h2 className="mt-3 font-display text-display-sm">Dark tone</h2>
              <p className="mt-4 u-measure-tight font-sans text-small text-text-muted">
                Not a theme toggle &mdash; an editorial device. Any section can
                be set to dark and every component inside adapts with no
                dark-specific styling.
              </p>
            </div>
            <div className="col-span-4 mt-10 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
              <h3 className="font-display text-display-lg u-optical-left">
                Night falls on the same system.
              </h3>
              <p className="mt-8 u-measure font-sans text-lead text-text-muted">
                Identical components, identical markup. The tokens are re-mapped
                by a single data attribute on the section wrapper.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Button variant="solid">Request a quote</Button>
                <Button variant="hairline">Book a consultation</Button>
                <ArrowLink href="/styleguide">View all yurts</ArrowLink>
              </div>
              <div className="mt-12 space-y-6">
                <Rule index="04" label="Customisation" />
                <Rule index="05" label="Quality check" />
              </div>
              <div className="mt-12 max-w-md">
                <TextField
                  id="sg-dark"
                  label="Email"
                  placeholder="you@company.com"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- FOOT ---- */}
      <footer className="u-container py-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-6">
          <Metadata>Theyurts &mdash; Design system v0.1</Metadata>
          <Metadata>Phase 00 &middot; Foundation</Metadata>
        </div>
      </footer>
    </div>
  );
}
