import {
  doorDepthsMm,
  doorTypes,
  domeOperation,
  finishColours,
  layouts,
  priceLabel,
  shellSizes,
  sizeLabel,
  toiletWindowColours,
  windowSpec,
} from "@/data/specifications";
import { joineryFinishes } from "@/data/materials";
import { SpecList } from "@/components/page/SpecList";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Rule } from "@/components/primitives/Rule";

/**
 * The workshop's standard specification, stated once for the whole range.
 *
 * WHY IT LIVES HERE AND NOT ON THE MODEL PAGES. The three sizes, the three
 * layouts and the finishes are properties of the shell, not of any one of the
 * ten models — a Symmetry is a Symmetry whether it is being used as a Resort or
 * a Café. Each model page repeats the parts that apply to it (see
 * `data/products.ts`), but the priced comparison belongs in one place, because
 * the whole point of it is reading the three against each other.
 *
 * THE PRICE CAVEAT IS NOT DECORATION. The sheet quotes one price per layout and
 * door depth, with no diameter attached — so a price here is not "a 6000mm
 * Symmetry", it is "a Symmetry". The note below the table says so rather than
 * letting the numbers imply a precision the sheet does not have. If the workshop
 * later prices per size, this becomes a matrix and the note goes.
 *
 * No table element: the site has no card borders and no boxed data, and a real
 * table would need horizontal scroll on a phone. Each layout is a hairline-ruled
 * row that stacks instead.
 */
export function StandardSpecification() {
  return (
    <>
      {/* Sizes ------------------------------------------------------------ */}
      <section className="border-t border-line py-(--spacing-block)">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <Metadata className="text-accent-text">Sizes</Metadata>
              <h2 className="mt-3 font-display text-display-sm">
                Three shells.
              </h2>
            </div>
          </header>

          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <p className="u-measure font-sans text-body text-text-muted">
              Every yurt is built on one of three shells. The wall height is the
              same on all of them — {shellSizes[0].wallHeightMm}mm — so what the
              diameter changes is the floor and how far the roof climbs to the
              crown.
            </p>

            <div className="mt-10 space-y-8">
              {shellSizes.map((size, i) => (
                <Reveal key={size.id} kind="up" delay={i * 0.06}>
                  <div className="border-t border-line pt-6">
                    <h3 className="font-display text-display-sm">
                      {sizeLabel(size)}
                    </h3>
                    <SpecList
                      size="small"
                      className="mt-5"
                      specs={[
                        {
                          label: "Floor area",
                          value: String(size.areaSqFt),
                          unit: "sq ft",
                          note: null,
                        },
                        {
                          label: "Diameter",
                          value: String(size.diameterM.toFixed(1)),
                          unit: "m",
                          note: null,
                        },
                        {
                          label: "Wall height",
                          value: String(size.wallHeightMm),
                          unit: "mm",
                          note: null,
                        },
                        {
                          label: "Roof rise",
                          value: String(size.roofRiseMm),
                          unit: "mm",
                          note: null,
                        },
                      ]}
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Layouts ---------------------------------------------------------- */}
      <section className="border-t border-line py-(--spacing-block)">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <Metadata className="text-accent-text">Layouts</Metadata>
              <h2 className="mt-3 font-display text-display-sm">
                Three ways to open it.
              </h2>
            </div>
          </header>

          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <p className="u-measure font-sans text-body text-text-muted">
              The shell does not change between these. What changes is how many
              doors and windows are cut into it — and that is what moves the
              price.
            </p>

            <div className="mt-10">
              {layouts.map((layout, i) => (
                <Reveal key={layout.id} kind="up" delay={i * 0.06}>
                  <div className="border-t border-line py-8 last:border-b">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                      <h3 className="font-display text-display-sm">
                        {layout.name}
                      </h3>
                      <Metadata className="text-text-muted">
                        {layout.doors} {layout.doors === 1 ? "door" : "doors"}
                        {" · "}
                        {layout.windows} windows
                        {" · "}
                        {layout.toiletWindows} toilet
                        {layout.toiletWindows === 1 ? " window" : " windows"}
                      </Metadata>
                    </div>

                    <p className="mt-3 u-measure font-sans text-small text-text-muted">
                      {layout.note}
                    </p>

                    <dl className="mt-6 flex flex-wrap gap-x-14 gap-y-5">
                      {layout.variants.map((variant) => (
                        <div key={variant.doorDepthMm}>
                          <dd className="font-display text-display-sm">
                            {priceLabel(variant.price)}
                          </dd>
                          <dt className="mt-2 font-sans text-meta uppercase text-text-muted">
                            {variant.doorDepthMm}mm door
                          </dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="mt-8 u-measure font-sans text-small text-text-muted opacity-80">
              Indicative prices for the structure, quoted per layout and door
              depth. They do not vary by diameter on the current sheet, and they
              exclude the site itself — foundation, access, services and
              transport are costed once we know where it is going.
            </p>
          </div>
        </div>
      </section>

      {/* Finishes --------------------------------------------------------- */}
      <section className="border-t border-line py-(--spacing-block)">
        <div className="u-grid">
          <header className="col-span-4 md:col-span-6 lg:col-span-3">
            <div className="lg:sticky lg:top-32">
              <Metadata className="text-accent-text">Finishes</Metadata>
              <h2 className="mt-3 font-display text-display-sm">
                Doors, windows, dome.
              </h2>
            </div>
          </header>

          <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
            <dl className="grid gap-x-10 sm:grid-cols-2">
              <Finish title="Doors">
                {doorTypes.join(" or ")}, at {doorDepthsMm.join("mm or ")}mm.
              </Finish>
              <Finish title="Door &amp; window colours" swatches={joineryFinishes}>
                {finishColours.join(", ")}.
              </Finish>
              <Finish title="Windows">
                {windowSpec.material} {windowSpec.type.toLowerCase()}s, in{" "}
                {windowSpec.colours.join(", ")}.
              </Finish>
              <Finish title="Toilet windows">
                {windowSpec.material} {windowSpec.type.toLowerCase()}s, in{" "}
                {toiletWindowColours.join(", ")}.
              </Finish>
              <Finish title="Crown dome">
                {domeOperation}, on every size and layout.
              </Finish>
            </dl>

            <Rule
              label="Anything outside this is drawn and quoted per project"
              className="mt-10"
            />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * One finish row, optionally with real colour chips beside it.
 *
 * The chips are the actual authored colours out of the workshop's SketchUp
 * model (see `data/materials.ts`), not approximations picked to look right — so
 * a walnut chip here and a walnut door in the 3D builder are the same number.
 * Each still carries its name in text, because colour alone is not a label and
 * a chip is invisible to anyone reading this with a screen reader.
 */
function Finish({
  title,
  children,
  swatches,
}: {
  title: string;
  children: React.ReactNode;
  swatches?: { id: string; label: string; frame: string }[];
}) {
  return (
    <div className="border-t border-line py-5">
      <dt className="font-display text-display-sm">{title}</dt>
      <dd className="mt-2 font-sans text-small text-text-muted">{children}</dd>
      {swatches?.length ? (
        <dd className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {swatches.map((swatch) => (
            <span key={swatch.id} className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="size-5 rounded-full border border-line"
                style={{ backgroundColor: swatch.frame }}
              />
              <span className="font-sans text-meta uppercase text-text-muted">
                {swatch.label}
              </span>
            </span>
          ))}
        </dd>
      ) : null}
    </div>
  );
}
