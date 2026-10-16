import { cn } from "@/lib/cn";
import { formatPrice, SHIPPING_REGION, SHIPPING_TIME, sizePricing } from "@/data/pricing";
import { positionLabel, type PricedQuote } from "@/lib/quote";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * The order summary: what is being asked for, row by row, and what it costs.
 *
 * Plain tables, because it is tabular — a screen reader can walk the door and
 * window rows by column, and the visitor can read across a row the way they
 * would on a printed quote.
 *
 * Shown one part at a time — the builder puts the parts behind tabs, so the
 * summary fits the panel instead of scrolling through every table.
 */

export type SummaryView = "yurt" | "openings" | "price";

const th = "py-2 pr-3 text-left font-sans text-[0.625rem] font-normal uppercase tracking-[0.12em] text-text-muted";
const td = "py-2 pr-3 align-top font-sans text-small text-text";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4 border border-line first:mt-0">
      <h3 className="border-b border-line bg-surface-alt px-3 py-2 font-sans text-meta uppercase text-text">
        {title}
      </h3>
      <div className="overflow-x-auto px-3">{children}</div>
    </section>
  );
}

export function QuoteSummary({
  view,
  priced,
  configuration,
}: {
  view: SummaryView;
  priced: PricedQuote;
  /** Label / value / price rows for the yurt itself. */
  configuration: { label: string; value: string; price?: string; swatch?: string }[];
}) {
  if (view === "yurt") {
    return (
      <Section title="Configuration">
        <table className="w-full">
          <tbody className="divide-y divide-line">
            {configuration.map((row) => (
              <tr key={row.label}>
                <th scope="row" className={th}>
                  {row.label}
                </th>
                <td className={td}>
                  <span className="inline-flex items-center gap-2">
                    {row.swatch ? (
                      <span
                        aria-hidden
                        className="size-3 shrink-0 border border-line-strong"
                        style={{ background: row.swatch }}
                      />
                    ) : null}
                    {row.value}
                  </span>
                </td>
                <td className={cn(td, "whitespace-nowrap pr-0 text-right text-text-muted")}>
                  {row.price ?? "Included"}
                </td>
              </tr>
            ))}
            {priced.accessories.map((item) => (
              <tr key={item.label}>
                <th scope="row" className={th}>
                  Accessory
                </th>
                <td className={td}>{item.label}</td>
                <td className={cn(td, "whitespace-nowrap pr-0 text-right")}>
                  {formatPrice(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    );
  }

  if (view === "openings") {
    return (
      <div>
        <Section title="Doors">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className={th}>Pos.</th>
                <th className={th}>Style</th>
                <th className={th}>Finish</th>
                <th className={cn(th, "pr-0 text-right")}>Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {priced.doors.map((row) => (
                <tr key={row.position}>
                  <td className={td}>{positionLabel("D", row.position)}</td>
                  <td className={td}>
                    {row.style.label}
                    <span className="block text-text-muted">{row.lock}</span>
                  </td>
                  <td className={td}>{row.finish?.label ?? (row.style.colourable ? "Standard" : "Frame colour")}</td>
                  <td className={cn(td, "whitespace-nowrap pr-0 text-right")}>
                    {row.price ? formatPrice(row.price) : "Included"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Windows">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className={th}>Pos.</th>
                <th className={th}>Type</th>
                <th className={th}>Finish</th>
                <th className={cn(th, "pr-0 text-right")}>Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {priced.windows.map((row) => (
                <tr key={row.position}>
                  <td className={td}>{positionLabel("W", row.position)}</td>
                  <td className={td}>{row.type.label}</td>
                  <td className={td}>{row.finish?.label ?? "Standard"}</td>
                  <td className={cn(td, "whitespace-nowrap pr-0 text-right")}>
                    {row.included ? "Included" : formatPrice(row.price)}
                  </td>
                </tr>
              ))}
              {priced.plan.toiletWindows > 0 ? (
                <tr>
                  <td className={td}>—</td>
                  <td className={td} colSpan={2}>
                    Toilet windows, fixed glass × {priced.plan.toiletWindows}
                  </td>
                  <td className={cn(td, "pr-0 text-right")}>Included</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <Section title="Price summary">
        <table className="w-full">
          <tbody className="divide-y divide-line">
            {priced.lines.map((line) => (
              <tr key={line.label}>
                <th scope="row" className={cn(th, "normal-case tracking-normal text-small text-text")}>
                  {line.label}
                </th>
                <td className={cn(td, "whitespace-nowrap pr-0 text-right")}>
                  {line.amount === null ? (
                    <span className="text-text-muted">{line.note ?? "TBD"}</span>
                  ) : (
                    formatPrice(line.amount)
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row" className="py-3 text-left font-sans text-body font-medium text-text">
                Estimated total
              </th>
              <td className="py-3 text-right font-display text-display-sm leading-none text-accent-text">
                {formatPrice(priced.total)}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        {[
          ["Shipping", SHIPPING_REGION],
          ["Manufacturing", sizePricing[priced.plan.size].manufacturing],
          ["Shipping time", SHIPPING_TIME],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-line pt-2">
            <Metadata as="dt">{label}</Metadata>
            <dd className="mt-1 font-sans text-small text-text">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-sans text-small text-text-muted">
        All costs are estimates, ex works Bangalore, and non-binding — the final
        quote is. We send a precise shipping quote once we have your site
        details.
      </p>
    </div>
  );
}
