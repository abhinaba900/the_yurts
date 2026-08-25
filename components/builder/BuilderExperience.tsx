"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import {
  decodeSelection,
  defaultSelection,
  encodeSelection,
  renderSpecFor,
  resolveSelection,
  summarise,
  type GroupDef,
  type OptionGroupId,
  type Selection,
} from "@/lib/configurator";
import { BuilderCanvas } from "./BuilderCanvas";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * The configurator.
 *
 * Options are native radio inputs inside fieldsets — arrow-key navigation,
 * grouping and announcement all come from the browser rather than from
 * JavaScript reimplementing them badly. The visual treatment is a hairline row
 * with a clay marker, not a grid of chunky swatch buttons.
 *
 * The selection is mirrored into the URL with `replaceState`, so a configuration
 * can be shared or bookmarked without adding a history entry per click.
 */
export function BuilderExperience({ groups }: { groups: GroupDef[] }) {
  const reducedMotion = useReducedMotion();
  const [selection, setSelection] = useState<Selection>(() =>
    resolveSelection(defaultSelection, groups),
  );
  const [cutaway, setCutaway] = useState(false);
  const [ready, setReady] = useState(false);

  // Restore from the URL on mount. Read here rather than through
  // useSearchParams so this component needs no Suspense boundary.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = decodeSelection(params.get("c"));
    if (Object.keys(fromUrl).length > 0) {
      setSelection(resolveSelection({ ...defaultSelection, ...fromUrl }, groups));
    }
    setReady(true);
  }, [groups]);

  // Mirror the selection into the URL, without a history entry per change.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    params.set("c", encodeSelection(selection));
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [selection, ready]);

  const spec = useMemo(() => renderSpecFor(selection, groups), [selection, groups]);
  const summary = useMemo(() => summarise(selection, groups), [selection, groups]);
  const enquiryHref = `/enquire?config=${encodeSelection(selection)}`;

  const choose = (group: OptionGroupId, option: string) =>
    setSelection((current) => ({ ...current, [group]: option }));

  const isDefault = groups.every(
    (group) => selection[group.id] === group.options[0].id,
  );

  return (
    <div className="landscape-split:flex lg:flex lg:min-h-[calc(100svh-5rem)]">
      {/* ---- Stage ---- */}
      <div className="relative landscape-split:sticky landscape-split:top-20 landscape-split:h-[calc(100svh-5rem)] landscape-split:w-[58%] landscape-split:shrink-0 lg:sticky lg:top-20 lg:h-[calc(100svh-5rem)] lg:w-[58%] lg:shrink-0">
        <div className="h-[52svh] w-full bg-surface-alt landscape-split:h-full lg:h-full">
          <BuilderCanvas
            spec={spec}
            cutaway={cutaway}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Stage controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
          <div className="pointer-events-auto flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCutaway((value) => !value)}
              aria-pressed={cutaway}
              className={cn(
                "border px-4 py-2 font-sans text-meta uppercase transition-colors duration-(--duration-quick)",
                cutaway
                  ? "border-accent bg-accent text-cream"
                  : "border-line-strong bg-surface text-text hover:border-text",
              )}
            >
              {cutaway ? "Hide structure" : "Show structure"}
            </button>

            <p className="hidden font-sans text-meta uppercase text-text-muted sm:block">
              Drag to rotate &middot; scroll to zoom
            </p>
          </div>
        </div>
      </div>

      {/* ---- Options ---- */}
      <div className="landscape-split:w-[42%] lg:w-[42%]">
        <div className="u-container py-14 lg:px-10 lg:py-16">
          <header>
            <Metadata className="text-accent-text">Build one</Metadata>
            <h2 className="mt-4 font-display text-display-md">Your yurt.</h2>
            <p className="mt-5 u-measure font-sans text-body text-text-muted">
              Work out roughly what you want, then send it to us. It is a
              starting point for a conversation, not an order.
            </p>
            <p className="mt-4 u-measure font-sans text-small text-text-muted">
              Finishes and proportions shown here are indicative. The confirmed
              range, with real dimensions, is published once the workshop settles
              it.
            </p>
          </header>

          <div className="mt-12 space-y-10">
            {groups.map((group) => (
              <fieldset key={group.id} className="border-0 p-0">
                <legend className="flex w-full items-baseline justify-between gap-4 border-t border-line pt-4">
                  <span className="font-sans text-meta uppercase text-text">
                    {group.label}
                  </span>
                  <span className="font-sans text-meta uppercase text-accent-text">
                    {group.options.find((o) => o.id === selection[group.id])?.label}
                  </span>
                </legend>

                {group.note ? (
                  <p className="mt-2 font-sans text-small text-text-muted">
                    {group.note}
                  </p>
                ) : null}

                <div className="mt-4">
                  {group.options.map((option) => {
                    const id = `${group.id}-${option.id}`;
                    const checked = selection[group.id] === option.id;

                    return (
                      <div key={option.id}>
                        <input
                          type="radio"
                          id={id}
                          name={group.id}
                          value={option.id}
                          checked={checked}
                          onChange={() => choose(group.id, option.id)}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor={id}
                          className={cn(
                            "flex cursor-pointer items-baseline gap-4 py-3",
                            "border-t border-line first:border-t-0",
                            "transition-colors duration-(--duration-quick)",
                            "peer-focus-visible:outline peer-focus-visible:outline-offset-2",
                            "peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-accent",
                            checked ? "text-text" : "text-text-muted hover:text-text",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "mt-2 block h-px w-6 shrink-0 transition-colors duration-(--duration-quick)",
                              checked ? "bg-accent" : "bg-line",
                            )}
                          />
                          <span>
                            <span className="block font-sans text-lead">
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className="mt-0.5 block font-sans text-small text-text-muted">
                                {option.description}
                              </span>
                            ) : null}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {/* ---- Summary ---- */}
          <section className="mt-16 border-t border-line pt-8">
            <Metadata className="text-accent-text">Your yurt</Metadata>

            <dl className="mt-6">
              {summary.map((row) => (
                <div
                  key={row.group}
                  className="flex items-baseline justify-between gap-6 border-t border-line py-2.5"
                >
                  <dt className="font-sans text-meta uppercase text-text-muted">
                    {row.label}
                  </dt>
                  <dd className="font-sans text-body">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col items-start gap-5">
              <Link
                href={enquiryHref}
                className="group inline-flex h-13 items-center justify-center gap-3 bg-text px-7 font-sans text-meta uppercase text-surface transition-colors duration-(--duration-quick) hover:bg-accent-text"
              >
                Request this configuration
                <span
                  aria-hidden
                  className="transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              {!isDefault ? (
                <button
                  type="button"
                  onClick={() => setSelection(resolveSelection(defaultSelection, groups))}
                  className="font-sans text-meta uppercase text-text-muted underline underline-offset-8 transition-colors duration-(--duration-quick) hover:text-text"
                >
                  Start again
                </button>
              ) : null}
            </div>

            <p className="mt-8 u-measure font-sans text-small text-text-muted">
              Your selection travels with the enquiry, so the first reply is about
              this rather than about yurts in general.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
