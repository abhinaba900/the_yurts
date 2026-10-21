"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import {
  decodeSelection,
  defaultSelection,
  encodeSelection,
  isAvailable,
  renderSpecFor,
  resolveSelection,
  type GroupDef,
  type OptionGroupId,
  type Selection,
} from "@/lib/configurator";
import { EXTERIOR, sizeById, type YurtSizeId } from "@/data/yurtModel";
import {
  accessoryPrices,
  CUSTOM_PLAN,
  doorStyles,
  EXTRA_WINDOW,
  fabricSpec,
  formatPrice,
  lockStyles,
  plansFor,
  sizePricing,
  windowTypes,
  woodFinishes,
} from "@/data/pricing";
import {
  decodeQuote,
  emptyQuote,
  encodeQuote,
  positionLabel,
  priceQuote,
  quoteText,
  windowsOf,
  type Quote,
} from "@/lib/quote";
import { PlanRing } from "./PlanRing";
import { QuoteSummary, type SummaryView } from "./QuoteSummary";
import { QuoteForm } from "./QuoteForm";
import { BuilderCanvas, type ViewCommand } from "./BuilderCanvas";
import {
  allParts,
  noOffsets,
  PART_IDS,
  partLabels,
  type PartId,
  type Parts,
} from "./parts";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * The configurator, as a six-step walk-through: size, plan, doors and windows,
 * colours, add-ons, and a summary with the price and a quote request.
 *
 * Steps rather than one long form because each step changes one thing on the
 * model, and the model is what people are here for: the panel asks one question
 * at a time and the stage answers it. Every step has a sensible default, so the
 * stepper is navigation, not a gate — anyone can jump straight to colours.
 *
 * Options are still native inputs inside fieldsets — radios for choices,
 * checkboxes for add-ons — so arrow-key navigation, grouping and announcement
 * come from the browser rather than from JavaScript reimplementing them.
 *
 * The camera follows the step: a fitted-out plan is shown from above with the
 * roof off, colours are shown from outside with it on.
 *
 * PRICES. Every choice that costs something says what it costs where it is
 * made, and the running estimate sits on the stage. The sums are in
 * `lib/quote.ts`, the numbers in `data/pricing.ts`. The visitor can override
 * either with the stage controls.
 *
 * The selection is mirrored into the URL with `replaceState`, so a
 * configuration can be shared or bookmarked without adding a history entry per
 * click.
 */

type StepId = "size" | "plan" | "doors" | "colours" | "addons" | "review";

const STEPS: { id: StepId; label: string; groups: OptionGroupId[] }[] = [
  { id: "size", label: "Size", groups: ["size"] },
  { id: "plan", label: "Plan", groups: ["layout"] },
  { id: "doors", label: "Doors", groups: [] },
  { id: "colours", label: "Colours", groups: ["roof", "exterior"] },
  { id: "addons", label: "Add-ons", groups: ["opener", "blinds", "flooring"] },
  { id: "review", label: "Summary", groups: [] },
];

/** The summary step's tabs: the order in parts, then the request form. */
const SUMMARY_TABS: { id: SummaryView | "quote"; label: string }[] = [
  { id: "yurt", label: "Yurt" },
  { id: "openings", label: "Doors & windows" },
  { id: "price", label: "Price" },
  { id: "quote", label: "Get quote" },
];

/** Combinations that work, as a quicker start than 56 swatches. */
const QUICK_PICKS: { label: string; roof: string; exterior: string }[] = [
  { label: "Classic", roof: "antelope", exterior: "champagne" },
  { label: "Forest", roof: "garden-green", exterior: "champagne" },
  { label: "Monsoon", roof: "concrete", exterior: "white" },
  { label: "Desert", roof: "rust", exterior: "peach" },
  { label: "Coast", roof: "lagoon", exterior: "white" },
];

/** Whether dark ink reads on a swatch — for its check mark. */
function isLight(hex: string | undefined): boolean {
  if (!hex) return true;
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
    >
      <path d={path} />
    </svg>
  );
}

const icons = {
  check: "M5 12.5l4.5 4.5L19 7.5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  reset: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5",
  rotate: "M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5",
  plan: "M4 4h16v16H4zM4 12h16M12 4v16",
  cube: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9",
  front: "M3 20h18M6 20V10l6-5 6 5v10M10 20v-5h4v5",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5",
  arrowLeft: "M19 12H5M11 6l-6 6 6 6",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  drag: "M8 9l-4 3 4 3M16 9l4 3-4 3M4 12h16",
};

/** The size cards' line drawing: a yurt in elevation, drawn to scale. */
function YurtElevation({ diameter, className }: { diameter: number; className?: string }) {
  // Drawn in a 120 × 70 box where 10m fills the width.
  const w = (diameter / 10) * 100;
  const x = (120 - w) / 2;
  const wall = 18 + diameter * 0.6;
  const base = 64;
  const eave = base - wall;
  const peak = eave - (w / 2) * 0.42;
  return (
    <svg viewBox="0 0 120 70" aria-hidden className={className} fill="none">
      <path
        d={`M${x} ${base}V${eave}M${x + w} ${base}V${eave}M${x - 2} ${eave}L${60 - 4} ${peak}H${60 + 4}L${x + w + 2} ${eave}Z`}
        stroke="currentColor"
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <path d={`M${x} ${eave + 3}H${x + w}`} stroke="currentColor" strokeWidth={0.6} opacity={0.6} />
      <path d={`M4 ${base}H116`} stroke="currentColor" strokeWidth={0.6} opacity={0.5} />
      <rect
        x={60 - 4}
        y={base - wall * 0.78}
        width={8}
        height={wall * 0.78}
        stroke="currentColor"
        strokeWidth={0.8}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Small controls                                                             */
/* -------------------------------------------------------------------------- */

/** A square icon button on the stage. */
function StageButton({
  label,
  icon,
  onClick,
  pressed,
  className,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "grid size-10 place-items-center border backdrop-blur-sm",
        "transition-colors duration-(--duration-quick)",
        "focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        pressed
          ? "border-accent bg-accent text-cream"
          : "border-line-strong bg-surface/85 text-text hover:border-text",
        className,
      )}
    >
      <Icon path={icon} />
    </button>
  );
}

/** A labelled toggle on the stage. */
function StageToggle({
  label,
  icon,
  pressed,
  onClick,
}: {
  label: string;
  icon: string;
  pressed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={cn(
        "inline-flex h-10 items-center gap-2 border px-3 font-sans text-meta uppercase backdrop-blur-sm",
        "transition-colors duration-(--duration-quick)",
        "focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-accent-text",
        pressed
          ? "border-accent bg-accent text-cream"
          : "border-line-strong bg-surface/85 text-text hover:border-text",
      )}
    >
      <Icon path={icon} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/** A compact native select for the door and window rows. */
function MiniSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        "h-9 w-full min-w-0 border border-line bg-surface-alt px-2 font-sans text-small text-text",
        "outline-none transition-colors duration-(--duration-quick) hover:border-line-strong focus:border-accent-text",
        "disabled:opacity-50",
      )}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/** The heading block at the top of each step. */
function StepHeading({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header>
      <Metadata className="text-accent-text">
        Step {index + 1} of {STEPS.length}
      </Metadata>
      <h2 className="mt-3 font-display text-display-sm">{title}</h2>
      {children ? (
        <p className="mt-3 font-sans text-small text-text-muted">{children}</p>
      ) : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */

export function BuilderExperience({ groups }: { groups: GroupDef[] }) {
  const reducedMotion = useReducedMotion();
  const [selection, setSelection] = useState<Selection>(() =>
    resolveSelection(defaultSelection, groups),
  );
  const [quote, setQuote] = useState<Quote>(emptyQuote);
  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [visited, setVisited] = useState<Set<StepId>>(() => new Set(["size"]));
  const step = STEPS[stepIndex];

  // Stage state.
  const [cutaway, setCutaway] = useState(false);
  const [view, setView] = useState<"3d" | "plan" | "front">("3d");
  const [command, setCommand] = useState<ViewCommand>({ kind: "reset", n: 0 });
  const [autoRotate, setAutoRotate] = useState(false);
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryTab, setSummaryTab] = useState<SummaryView | "quote">("yurt");
  const panelRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLElement>(null);

  const move = useCallback((kind: ViewCommand["kind"]) => {
    setCommand((current) => ({ kind, n: current.n + 1 }));
    if (kind === "reset") setView("3d");
    if (kind === "plan") setView("plan");
    if (kind === "front") setView("front");
  }, []);

  // Which parts are on the stage, and how far apart they are pulled.
  //
  // Deliberately NOT mirrored into the URL alongside the selection: this is how
  // someone is looking at the structure, not what they are asking us to build,
  // and a shared link should open on the finished yurt rather than on whatever
  // half-dismantled state the sender left behind.
  const [parts, setParts] = useState<Parts>(allParts);
  const [offsets, setOffsets] = useState<Record<PartId, number>>(noOffsets);
  const [inspecting, setInspecting] = useState(false);

  const togglePart = (id: PartId) =>
    setParts((current) => ({ ...current, [id]: !current[id] }));

  /** The slider writes every offset at once. */
  const setAllOffsets = (value: number) =>
    setOffsets(
      Object.fromEntries(PART_IDS.map((id) => [id, value])) as Record<
        PartId,
        number
      >,
    );

  /** A drag writes one, clamped so a part cannot be thrown out of frame. */
  const dragPart = useCallback((id: PartId, delta: number) => {
    setOffsets((current) => ({
      ...current,
      [id]: Math.min(2, Math.max(0, current[id] + delta)),
    }));
  }, []);

  // The slider shows the common value when every part agrees, and holds its
  // last position once a part has been dragged out of step with the others.
  const spread = PART_IDS.map((id) => offsets[id]);
  const uniformOffset = spread.every((value) => value === spread[0])
    ? spread[0]
    : null;

  const partsAreDefault =
    spread.every((value) => value === 0) && PART_IDS.every((id) => parts[id]);

  // Restore from the URL on mount. Read here rather than through
  // useSearchParams so this component needs no Suspense boundary.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = decodeSelection(params.get("c"));
    if (Object.keys(fromUrl).length > 0) {
      setSelection(resolveSelection({ ...defaultSelection, ...fromUrl }, groups));
    }
    setQuote(decodeQuote(params.get("q")));
    setReady(true);
  }, [groups]);

  // Mirror the selection into the URL, without a history entry per change.
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    params.set("c", encodeSelection(selection));
    const encodedQuote = encodeQuote(quote);
    if (encodedQuote) params.set("q", encodedQuote);
    else params.delete("q");
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [selection, quote, ready]);

  const spec = useMemo(() => renderSpecFor(selection, groups), [selection, groups]);
  const enquiryHref = `/enquire?config=${encodeSelection(selection)}`;
  const size = sizeById(selection.size);
  const groupById = (id: OptionGroupId) => groups.find((group) => group.id === id);
  const optionOf = (id: OptionGroupId) =>
    groupById(id)?.options.find((option) => option.id === selection[id]);
  const hasInterior = (optionOf("layout")?.render.layout ?? EXTERIOR) !== EXTERIOR;

  const priced = useMemo(
    () =>
      priceQuote(size.id, selection.layout, quote, {
        opener: selection.opener === "added",
        blinds: selection.blinds === "added",
      }),
    [size.id, selection.layout, selection.opener, selection.blinds, quote],
  );
  const placedWindows = windowsOf(quote, priced.plan);

  const toggleWindow = (position: number) =>
    setQuote((current) => {
      const now = windowsOf(current, priced.plan);
      return {
        ...current,
        windows: now.includes(position)
          ? now.filter((item) => item !== position)
          : [...now, position],
      };
    });

  const setRow = (key: "windowType" | "windowFinish" | "doorStyle" | "doorFinish", position: number, value: string) =>
    setQuote((current) => ({ ...current, [key]: { ...current[key], [position]: value } }));

  /** Every change goes through here, so it stays consistent across groups. */
  const choose = (group: OptionGroupId, option: string) => {
    setSelection((current) => resolveSelection({ ...current, [group]: option }, groups));
    if (group === "layout" || group === "size") {
      setQuote((current) => ({ ...current, windows: null }));
    }

    // Show what was just changed.
    if (group === "layout") {
      const layout = groupById("layout")?.options.find((item) => item.id === option)?.render.layout;
      if (layout && layout !== EXTERIOR) {
        setCutaway(true);
        if (view !== "plan") move("plan");
      } else {
        setCutaway(false);
        if (view === "plan") move("reset");
      }
    }
    if ((group === "roof" || group === "exterior") && cutaway) setCutaway(false);
    if ((group === "roof" || group === "exterior") && view === "plan") move("reset");
  };

  const isDefault =
    groups.every((group) => selection[group.id] === resolveSelection({}, groups)[group.id]) &&
    !encodeQuote(quote);

  const goTo = (index: number) => {
    const next = STEPS[Math.max(0, Math.min(STEPS.length - 1, index))];
    setStepIndex(STEPS.indexOf(next));
    setVisited((current) => new Set(current).add(next.id));
    // Back to the top of the new step: inside the panel where it scrolls on
    // its own, or the page, where the panel sits under a sticky stage.
    panelRef.current?.scrollTo({ top: 0 });
    const stepper = stepperRef.current;
    // Hidden above the viewport or behind the sticky stage, on small screens.
    const stageBottom = Math.max(window.innerHeight * 0.44, 288) + 64;
    if (
      stepper &&
      !window.matchMedia("(min-width: 64rem)").matches &&
      stepper.getBoundingClientRect().top < stageBottom
    ) {
      stepper.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
    }

    // Frame the model for the step.
    if (next.id === "plan" && hasInterior) {
      setCutaway(true);
      if (view !== "plan") move("plan");
    } else if (next.id !== "plan") {
      if (cutaway) setCutaway(false);
      if (view === "plan") move("reset");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be refused; the URL bar still has the link.
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Option renderers                                                       */
  /* ---------------------------------------------------------------------- */

  /** A grid of colour swatches. */
  const swatches = (groupId: OptionGroupId, columns = "grid-cols-7") => {
    const group = groupById(groupId);
    if (!group) return null;
    const chosen = optionOf(groupId);

    return (
      <fieldset className="border-0 p-0">
        <legend className="flex w-full items-center justify-between gap-4">
          <span className="font-sans text-meta uppercase text-text">{group.label}</span>
          <span className="flex items-center gap-2 font-sans text-small text-accent-text">
            <span
              aria-hidden
              className="size-3 border border-line-strong"
              style={{ background: chosen?.render.color }}
            />
            {chosen?.label}
          </span>
        </legend>
        <div className={cn("mt-3 grid gap-1.5", columns)}>
          {group.options.map((option) => {
            const id = `${group.id}-${option.id}`;
            const checked = selection[group.id] === option.id;
            return (
              <div key={option.id} className="relative">
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
                  title={option.label}
                  className={cn(
                    "grid aspect-square cursor-pointer place-items-center border",
                    "transition-[transform,box-shadow] duration-(--duration-quick) ease-(--ease-out-soft)",
                    "hover:scale-[1.08]",
                    "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text",
                    checked
                      ? "border-transparent ring-2 ring-accent-text ring-offset-2 ring-offset-surface"
                      : "border-line",
                  )}
                  style={{ background: option.render.color }}
                >
                  <span className="sr-only">{option.label}</span>
                  {checked ? (
                    <Icon
                      path={icons.check}
                      className={cn("size-4", isLight(option.render.color) ? "text-ink" : "text-cream")}
                    />
                  ) : null}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    );
  };

  /** A yes/no add-on as one checkbox card. */
  const addOnCard = (groupId: OptionGroupId, price: number) => {
    const group = groupById(groupId);
    if (!group) return null;
    const added = group.options.find((option) => option.id === "added");
    if (!added) return null;
    const checked = selection[groupId] === "added";
    const id = `${groupId}-toggle`;

    return (
      <div key={groupId}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={() => choose(groupId, checked ? "none" : "added")}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            "flex cursor-pointer items-start gap-4 border px-4 py-4",
            "transition-colors duration-(--duration-quick)",
            "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text",
            checked
              ? "border-accent-text bg-surface-alt"
              : "border-line hover:border-line-strong hover:bg-surface-alt/50",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-5 shrink-0 place-items-center border",
              checked ? "border-accent-text bg-accent-text text-surface" : "border-line-strong",
            )}
          >
            {checked ? <Icon path={icons.check} className="size-3" /> : null}
          </span>
          <span className="flex-1">
            <span className="block font-sans text-body text-text">{group.label}</span>
            {added.description ? (
              <span className="mt-0.5 block font-sans text-small text-text-muted">
                {added.description}
              </span>
            ) : null}
          </span>
          <span className="text-right">
            <span className="block font-sans text-body text-accent-text">{formatPrice(price)}</span>
            <span className="block font-sans text-meta uppercase text-text-muted">
              {checked ? "Added" : "Add"}
            </span>
          </span>
        </label>
      </div>
    );
  };

  /* ---------------------------------------------------------------------- */
  /* Steps                                                                  */
  /* ---------------------------------------------------------------------- */

  const sizeGroup = groupById("size");
  const sizePrice = sizePricing[size.id];
  const fromPrice = (sizeId: YurtSizeId) =>
    Math.min(...plansFor(sizeId).map((plan) => plan.price));

  /** The yurt itself, for the summary's configuration table. */
  const configurationRows = [
    { label: "Yurt size", value: `TOF ${sizePrice.name}` },
    { label: "Area", value: `${sizePrice.areaSqft} sq ft / ${sizePrice.areaM2} m²` },
    { label: "Plan", value: priced.plan.label, price: formatPrice(priced.plan.price) },
    ...fabricSpec.map((row) => ({ label: row.label, value: row.value })),
    {
      label: "Roof & valance",
      value: optionOf("roof")?.label ?? "",
      swatch: optionOf("roof")?.render.color,
    },
    {
      label: "Wall",
      value: optionOf("exterior")?.label ?? "",
      swatch: optionOf("exterior")?.render.color,
    },
    {
      label: "Deck",
      value: optionOf("flooring")?.label ?? "",
      swatch: optionOf("flooring")?.render.color,
    },
  ];

  const summaryText = quoteText(
    priced,
    configurationRows.map((row) => ({ label: row.label, value: row.value })),
  );

  const stepBody: Record<StepId, React.ReactNode> = {
    size: (
      <>
        <StepHeading index={0} title="Build your dream yurt.">
          Pick a size, choose a plan and colours, place the doors and windows,
          and see it come alive in 3D — with the price as you go.
        </StepHeading>
        {sizeGroup ? (
          <fieldset className="mt-7 border-0 p-0">
            <legend className="sr-only">Size</legend>
            <div className="grid grid-cols-3 gap-3">
              {sizeGroup.options.map((option) => {
                const info = sizeById(option.id);
                const pricing = sizePricing[info.id];
                const checked = selection.size === option.id;
                const id = `size-${option.id}`;
                return (
                  <div key={option.id}>
                    <input
                      type="radio"
                      id={id}
                      name="size"
                      value={option.id}
                      checked={checked}
                      onChange={() => choose("size", option.id)}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={id}
                      className={cn(
                        "relative flex h-full cursor-pointer flex-col border p-4",
                        "transition-colors duration-(--duration-quick)",
                        "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text",
                        checked
                          ? "border-accent-text bg-surface-alt"
                          : "border-line hover:border-line-strong hover:bg-surface-alt/50",
                      )}
                    >
                      {checked ? (
                        <span
                          aria-hidden
                          className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-accent-text text-surface"
                        >
                          <Icon path={icons.check} className="size-3" />
                        </span>
                      ) : null}
                      <span className="font-display text-display-sm leading-none">
                        TOF {info.feet}&rsquo;/{info.diameterM}m
                      </span>
                      <span className="mt-1.5 font-sans text-meta uppercase text-text-muted">
                        {pricing.areaSqft} ft² · {pricing.areaM2} m²
                      </span>
                      <YurtElevation
                        diameter={info.diameterM}
                        className={cn(
                          "my-4 w-full",
                          checked ? "text-accent-text" : "text-text-muted",
                        )}
                      />
                      <span className="font-sans text-small text-text-muted">
                        {option.description}
                      </span>
                      <span className="mt-3 border-t border-line pt-2 font-sans text-small text-text">
                        from{" "}
                        <span className="text-accent-text">{formatPrice(fromPrice(info.id))}</span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        <dl className="mt-6 grid grid-cols-3 border-t border-line">
          {[
            ["Diameter", `${size.diameterM} m`],
            ["Height", `${size.heightM} m`],
            ["Install", formatPrice(sizePrice.installation)],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-line py-3 pr-3">
              <dt className="font-sans text-meta uppercase text-text-muted">{label}</dt>
              <dd className="mt-1 font-sans text-body">{value}</dd>
            </div>
          ))}
        </dl>
      </>
    ),

    plan: (
      <>
        <StepHeading index={1} title="Choose a plan.">
          {size.id === "10m"
            ? "Our popular 10m plans, shown fitted out from above. Each price includes its doors, windows and covers."
            : size.id === "6m"
              ? "Our popular 6m plans. Each price includes its doors, windows and covers."
              : "Start from the 7m kit and place the doors and windows yourself."}
        </StepHeading>
        <fieldset className="mt-7 border-0 p-0">
          <legend className="sr-only">Plan</legend>
          <div className="grid gap-2.5">
            {plansFor(size.id).map((plan) => {
              const id = `layout-${plan.id}`;
              const checked = priced.plan.id === plan.id;
              return (
                <div key={plan.id}>
                  <input
                    type="radio"
                    id={id}
                    name="layout"
                    value={plan.id}
                    checked={checked}
                    onChange={() => choose("layout", plan.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "block cursor-pointer border transition-colors duration-(--duration-quick)",
                      "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text",
                      checked
                        ? "border-accent-text bg-surface-alt"
                        : "border-line hover:border-line-strong hover:bg-surface-alt/50",
                    )}
                  >
                    <span className="flex items-center gap-3 px-4 py-3.5">
                      <span
                        aria-hidden
                        className={cn(
                          "grid size-5 shrink-0 place-items-center rounded-full border",
                          checked ? "border-accent-text bg-accent-text text-surface" : "border-line-strong",
                        )}
                      >
                        {checked ? <Icon path={icons.check} className="size-3" /> : null}
                      </span>
                      <span className="flex-1 font-sans text-body text-text">{plan.label}</span>
                      <span className="font-sans text-body text-accent-text">
                        {formatPrice(plan.price)}
                      </span>
                    </span>
                    {checked ? (
                      <span className="block border-t border-line px-4 pb-3.5 pt-3">
                        <span className="block font-sans text-small text-text-muted">
                          {plan.description}
                        </span>
                        <span className="mt-3 grid grid-cols-3 gap-2">
                          {[
                            ["Doors", plan.doors.length],
                            ["Windows", plan.windows.length],
                            ["Toilet windows", plan.toiletWindows],
                          ].map(([label, value]) => (
                            <span key={label} className="block bg-surface px-2.5 py-2">
                              <span className="block font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
                                {label}
                              </span>
                              <span className="mt-0.5 block font-sans text-body text-text">{value}</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    ) : null}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
        {size.id !== "10m" ? (
          <button
            type="button"
            onClick={() => choose("size", "10m")}
            className="mt-5 inline-flex items-center gap-2 font-sans text-meta uppercase text-accent-text underline-offset-4 hover:underline"
          >
            See the 10m plans fitted out in 3D
            <Icon path={icons.arrowRight} />
          </button>
        ) : (
          <p className="mt-5 font-sans text-small text-text-muted">{groupById("layout")?.note}</p>
        )}
      </>
    ),

    doors: (
      <>
        <StepHeading index={2} title="Doors & windows.">
          Tap the wall to add or remove windows. {priced.plan.windows.length}{" "}
          {priced.plan.windows.length === 1 ? "is" : "are"} included in{" "}
          {priced.plan.id === CUSTOM_PLAN ? "the kit" : priced.plan.label}; each
          extra window is {formatPrice(EXTRA_WINDOW)} with its canopy.
        </StepHeading>

        <PlanRing
          className="mt-6"
          doors={priced.plan.doors}
          windows={placedWindows}
          included={priced.plan.windows.length}
          onToggle={toggleWindow}
        />
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-4 bg-accent-text" /> Door
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3.5 border border-emerald-light bg-accent" /> Window
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-3.5 border border-dashed border-line-strong" /> Free
          </span>
        </div>
        {quote.windows ? (
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setQuote((current) => ({ ...current, windows: null }))}
              className="font-sans text-meta uppercase text-text-muted underline underline-offset-4 hover:text-text"
            >
              Back to the plan&rsquo;s windows
            </button>
          </div>
        ) : null}

        {/* Doors */}
        <section className="mt-8">
          <div className="flex items-baseline justify-between border-b border-line pb-2">
            <h3 className="font-sans text-meta uppercase text-text">Doors</h3>
            <span className="font-sans text-meta uppercase text-text-muted">{lockStyles[0].label}</span>
          </div>
          <div className="divide-y divide-line">
            {priced.doors.map((row) => (
              <div key={row.position} className="grid grid-cols-[3.25rem_1fr_1fr] items-center gap-2 py-3">
                <span className="font-sans text-small text-accent-text">
                  {positionLabel("D", row.position)}
                </span>
                <MiniSelect
                  label={`Door style at ${row.position} o'clock`}
                  value={row.style.id}
                  onChange={(value) => setRow("doorStyle", row.position, value)}
                  options={doorStyles.map((style) => ({
                    id: style.id,
                    label: style.upgrade ? `${style.label} (+${formatPrice(style.upgrade)})` : `${style.label} (included)`,
                  }))}
                />
                <MiniSelect
                  label={`Door finish at ${row.position} o'clock`}
                  value={row.finish?.id ?? ""}
                  disabled={!row.style.colourable}
                  onChange={(value) => setRow("doorFinish", row.position, value)}
                  options={[
                    { id: "", label: row.style.colourable ? "Standard finish" : "Frame colour" },
                    ...woodFinishes,
                  ]}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Windows */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between border-b border-line pb-2">
            <h3 className="font-sans text-meta uppercase text-text">Windows</h3>
            <span className="font-sans text-meta uppercase text-text-muted">
              {placedWindows.length} placed
            </span>
          </div>
          {priced.windows.length === 0 ? (
            <p className="py-4 font-sans text-small text-text-muted">
              No windows yet — tap the wall above to add one.
            </p>
          ) : (
            <div className="divide-y divide-line">
              {priced.windows.map((row) => (
                <div key={row.position} className="grid grid-cols-[3.25rem_1fr_1fr] items-center gap-2 py-3">
                  <span className="font-sans text-small text-text">
                    {positionLabel("W", row.position)}
                    <span className="block font-sans text-[0.625rem] uppercase tracking-[0.1em] text-text-muted">
                      {row.included ? "Incl." : "+Extra"}
                    </span>
                  </span>
                  <MiniSelect
                    label={`Window type at ${row.position} o'clock`}
                    value={row.type.id}
                    onChange={(value) => setRow("windowType", row.position, value)}
                    options={windowTypes}
                  />
                  <MiniSelect
                    label={`Window finish at ${row.position} o'clock`}
                    value={row.finish?.id ?? ""}
                    onChange={(value) => setRow("windowFinish", row.position, value)}
                    options={[{ id: "", label: "Standard finish" }, ...woodFinishes]}
                  />
                </div>
              ))}
            </div>
          )}
          {priced.plan.toiletWindows > 0 ? (
            <p className="mt-2 font-sans text-small text-text-muted">
              Plus {priced.plan.toiletWindows} fixed-glass toilet window
              {priced.plan.toiletWindows === 1 ? "" : "s"}, included.
            </p>
          ) : null}
        </section>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-3 font-sans text-small">
          <span className="text-text-muted">Door & window extras</span>
          <span className="text-accent-text">
            {formatPrice(
              (priced.lines[1].amount ?? 0) + (priced.lines[2].amount ?? 0),
            )}
          </span>
        </div>
        <p className="mt-2 font-sans text-small text-text-muted">
          The 3D model shows the drawn door and windows; your placement goes on
          the quote and the build drawings.
        </p>
      </>
    ),

    colours: (
      <>
        <StepHeading index={3} title="Pick your colours.">
          The roof and its valance, and the wall — included in the yurt kit.
          Colours on screen are indicative; we send physical swatches before
          anything is made.
        </StepHeading>

        <div className="mt-6">
          <Metadata>Quick picks</Metadata>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {QUICK_PICKS.map((pick) => {
              const roof = groupById("roof")?.options.find((o) => o.id === pick.roof);
              const wall = groupById("exterior")?.options.find((o) => o.id === pick.exterior);
              if (!roof || !wall) return null;
              const active =
                selection.roof === pick.roof && selection.exterior === pick.exterior;
              return (
                <button
                  key={pick.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    choose("roof", pick.roof);
                    choose("exterior", pick.exterior);
                  }}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 border pl-1.5 pr-3 font-sans text-small",
                    "transition-colors duration-(--duration-quick)",
                    "focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-accent-text",
                    active
                      ? "border-accent-text bg-surface-alt text-text"
                      : "border-line text-text-muted hover:border-line-strong hover:text-text",
                  )}
                >
                  <span aria-hidden className="flex flex-col">
                    <span className="block h-2.5 w-6" style={{ background: roof.render.color }} />
                    <span className="block h-3.5 w-6" style={{ background: wall.render.color }} />
                  </span>
                  {pick.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {swatches("roof")}
          <div>
            {swatches("exterior")}
            {selection.roof !== selection.exterior ? (
              <button
                type="button"
                onClick={() => choose("exterior", selection.roof)}
                className="mt-3 font-sans text-meta uppercase text-text-muted underline underline-offset-4 transition-colors duration-(--duration-quick) hover:text-text"
              >
                Match the wall to the roof
              </button>
            ) : null}
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-2">
          {fabricSpec.map((row) => (
            <div key={row.label} className="border border-line bg-surface-alt/60 p-3">
              <dt className="font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
                {row.label}
              </dt>
              <dd className="mt-1 font-sans text-small text-text">{row.value}</dd>
              <dd className="mt-1 font-sans text-[0.625rem] uppercase tracking-[0.1em] text-accent-text">
                Included
              </dd>
            </div>
          ))}
        </dl>
      </>
    ),

    addons: (
      <>
        <StepHeading index={4} title="Accessories & deck.">
          Optional fittings for the crown dome, and the finish of the deck the
          yurt stands on.
        </StepHeading>
        <div className="mt-7 grid gap-2.5">
          {addOnCard("opener", accessoryPrices.opener)}
          {addOnCard("blinds", accessoryPrices.blinds)}
        </div>

        <fieldset className="mt-8 border-0 p-0">
          <legend className="flex w-full items-baseline justify-between">
            <span className="font-sans text-meta uppercase text-text">Deck</span>
            <span className="font-sans text-meta uppercase text-text-muted">Indicative</span>
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {groupById("flooring")?.options.map((option) => {
              const id = `flooring-${option.id}`;
              const checked = selection.flooring === option.id;
              return (
                <div key={option.id}>
                  <input
                    type="radio"
                    id={id}
                    name="flooring"
                    value={option.id}
                    checked={checked}
                    onChange={() => choose("flooring", option.id)}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border p-2.5",
                      "transition-colors duration-(--duration-quick)",
                      "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-text",
                      checked
                        ? "border-accent-text bg-surface-alt"
                        : "border-line hover:border-line-strong hover:bg-surface-alt/50",
                    )}
                  >
                    <span
                      aria-hidden
                      className="size-11 shrink-0 border border-line"
                      style={{
                        background: `repeating-linear-gradient(90deg, ${option.render.color} 0 9px, color-mix(in oklab, ${option.render.color} 80%, black) 9px 10px)`,
                      }}
                    />
                    <span className="font-sans text-body text-text">{option.label}</span>
                  </label>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-sans text-small text-text-muted">{groupById("flooring")?.note}</p>
        </fieldset>
      </>
    ),

    review: (
      <>
        <StepHeading index={5} title={`Your TOF ${sizePrice.name} is almost ready.`}>
          Check the order summary, then send it with your shipping details for
          an accurate quote. It is a starting point for a conversation, not an
          order.
        </StepHeading>

        <div className="mt-6 flex items-end justify-between gap-4 border border-accent-text bg-surface-alt px-4 py-4">
          <div>
            <Metadata>Estimated total</Metadata>
            <p className="mt-1.5 font-display text-display-sm leading-none text-accent-text">
              {formatPrice(priced.total)}
            </p>
          </div>
          <span className="text-right font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
            Ex works · incl. installation
            <br />
            Shipping extra
          </span>
        </div>

        {/* One part of the summary at a time, so it fits the panel. */}
        <div id="quote-form" role="tablist" aria-label="Order summary" className="mt-6 grid scroll-mt-24 grid-cols-4 border border-line">
          {SUMMARY_TABS.map((tab) => {
            const selected = summaryTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`summary-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="summary-panel"
                onClick={() => setSummaryTab(tab.id)}
                className={cn(
                  "min-h-10 border-l border-line px-1 py-2 font-sans leading-tight text-[0.625rem] uppercase tracking-[0.12em] transition-colors duration-(--duration-quick) first:border-l-0",
                  selected ? "bg-surface-alt text-accent-text" : "text-text-muted hover:text-text",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div id="summary-panel" role="tabpanel" aria-labelledby={`summary-tab-${summaryTab}`} className="mt-4">
          {summaryTab === "quote" ? (
            <QuoteForm configuration={encodeSelection(selection)} summary={summaryText} />
          ) : (
            <>
              <QuoteSummary view={summaryTab} priced={priced} configuration={configurationRows} />
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                {(summaryTab === "yurt"
                  ? STEPS.slice(0, -1).filter((item) => item.id !== "doors")
                  : summaryTab === "openings"
                    ? STEPS.filter((item) => item.id === "doors")
                    : []
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(STEPS.indexOf(item))}
                    className="font-sans text-meta uppercase text-accent-text underline-offset-4 hover:underline"
                  >
                    Edit {item.label.toLowerCase()}
                  </button>
                ))}
                {summaryTab !== "price" ? null : (
                  <button
                    type="button"
                    onClick={() => setSummaryTab("quote")}
                    className="font-sans text-meta uppercase text-accent-text underline-offset-4 hover:underline"
                  >
                    Request this quote
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-quick) hover:text-text"
            >
              <Icon path={copied ? icons.check : icons.link} />
              <span aria-live="polite">{copied ? "Link copied" : "Copy a link to this design"}</span>
            </button>
            <Link
              href={enquiryHref}
              className="font-sans text-meta uppercase text-text-muted underline underline-offset-4 hover:text-text"
            >
              Or use the general enquiry form
            </Link>
            {!isDefault ? (
              <button
                type="button"
                onClick={() => {
                  setSelection(resolveSelection(defaultSelection, groups));
                  setQuote(emptyQuote);
                  setCutaway(false);
                  move("reset");
                  goTo(0);
                }}
                className="font-sans text-meta uppercase text-text-muted underline underline-offset-4 transition-colors duration-(--duration-quick) hover:text-text"
              >
                Start again
              </button>
            ) : null}
          </div>
        </div>
      </>
    ),
  };

  const roofColour = optionOf("roof");
  const wallColour = optionOf("exterior");
  const next = STEPS[stepIndex + 1];

  return (
    <div className="landscape-split:grid landscape-split:h-[calc(100svh-4rem)] landscape-split:grid-cols-[minmax(0,1fr)_22rem] lg:grid lg:h-[calc(100svh-8.25rem)] lg:min-h-[38rem] lg:grid-cols-[minmax(0,1fr)_30rem] xl:grid-cols-[minmax(0,1fr)_34rem] 2xl:grid-cols-[minmax(0,1fr)_38rem]">
      {/* ---- Stage ---- */}
      <div className="sticky top-16 z-20 h-[44svh] min-h-[18rem] bg-surface-alt landscape-split:relative landscape-split:top-auto landscape-split:h-full lg:relative lg:top-auto lg:h-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, color-mix(in oklab, var(--color-cream) 9%, transparent), transparent 70%)",
          }}
        />
        <div className="absolute inset-0">
          <BuilderCanvas
            spec={spec}
            cutaway={cutaway}
            parts={parts}
            offsets={offsets}
            onDragPart={dragPart}
            interactive={inspecting}
            reducedMotion={reducedMotion}
            command={command}
            autoRotate={autoRotate}
            onInteract={() => {
              setTouched(true);
              if (view !== "3d") setView("3d");
            }}
          />
        </div>

        {/* Title and what is chosen, top left */}
        <div className="pointer-events-none absolute left-0 top-0 p-4 lg:p-6">
          <Metadata className="text-accent-text">3D yurt builder</Metadata>
          <p className="mt-1.5 font-display text-display-sm leading-none">
            Your {size.diameterM}m yurt
          </p>
          <div className="mt-3 hidden flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex">
            {[
              ["Roof", roofColour],
              ["Wall", wallColour],
            ].map(([label, option]) =>
              option && typeof option !== "string" ? (
                <span
                  key={label as string}
                  className="inline-flex items-center gap-1.5 font-sans text-meta uppercase text-text-muted"
                >
                  <span
                    aria-hidden
                    className="size-2.5 border border-line-strong"
                    style={{ background: option.render.color }}
                  />
                  {label as string} · {option.label}
                </span>
              ) : null,
            )}
            {hasInterior ? (
              <span className="font-sans text-meta uppercase text-text-muted">
                {optionOf("layout")?.label}
              </span>
            ) : null}
          </div>
        </div>

        {/* Running estimate, top right */}
        <button
          type="button"
          onClick={() => goTo(STEPS.length - 1)}
          className="absolute right-0 top-0 bg-surface/90 px-4 py-3 text-right backdrop-blur-sm transition-colors duration-(--duration-quick) hover:bg-surface lg:px-5"
          aria-label={`Estimated total ${formatPrice(priced.total)}. See the price summary`}
        >
          <span className="block font-display text-display-sm leading-none text-accent-text">
            {formatPrice(priced.total)}
          </span>
          <span className="mt-1 block font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
            Estimate · ex works
          </span>
        </button>

        {/* Drag hint, until the model has been moved */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-20 hidden justify-center transition-opacity duration-(--duration-base) sm:flex",
            touched ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="inline-flex items-center gap-2 bg-surface/80 px-3 py-1.5 font-sans text-meta uppercase text-text-muted backdrop-blur-sm">
            <Icon path={icons.drag} />
            Drag to look around
          </span>
        </div>

        {/* Stage controls, bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 lg:p-6">
          {inspecting ? (
            <div className="pointer-events-auto mb-3 max-w-sm border border-line-strong bg-surface/95 p-4 backdrop-blur-sm">
              <div className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                <span className="font-sans text-meta uppercase text-text">
                  Parts · drag one to pull it off
                </span>
                {!partsAreDefault ? (
                  <button
                    type="button"
                    onClick={() => {
                      setParts(allParts);
                      setOffsets(noOffsets);
                    }}
                    className="font-sans text-meta uppercase text-text-muted underline underline-offset-4 transition-colors duration-(--duration-quick) hover:text-text"
                  >
                    Reassemble
                  </button>
                ) : null}
              </div>

              <div className="mt-3">
                <label
                  htmlFor="explode"
                  className="flex items-baseline justify-between gap-4 font-sans text-meta uppercase text-text-muted"
                >
                  Pull apart everything
                  <span className="text-accent-text">
                    {uniformOffset === null
                      ? "Mixed"
                      : `${Math.round(uniformOffset * 100)}%`}
                  </span>
                </label>
                <input
                  id="explode"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round((uniformOffset ?? 0) * 100)}
                  onChange={(event) =>
                    setAllOffsets(Number(event.target.value) / 100)
                  }
                  className="mt-2 w-full accent-[var(--color-accent-text)]"
                />
              </div>

              <ul className="mt-4 grid grid-cols-2 gap-x-4">
                {PART_IDS.map((id) => (
                  <li key={id}>
                    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 font-sans text-small text-text-muted transition-colors duration-(--duration-quick) hover:text-text">
                      <input
                        type="checkbox"
                        checked={parts[id]}
                        onChange={() => togglePart(id)}
                        className="size-3.5 shrink-0 accent-[var(--color-accent-text)]"
                      />
                      <span className={parts[id] ? "text-text" : undefined}>
                        {partLabels[id]}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-end justify-between gap-3">
            <div className="pointer-events-auto flex items-center gap-2">
              <StageToggle
                label={cutaway ? "Roof off" : "See inside"}
                icon={icons.eye}
                pressed={cutaway}
                onClick={() => setCutaway((value) => !value)}
              />
              <StageToggle
                label="Take it apart"
                icon={icons.layers}
                pressed={inspecting}
                onClick={() => setInspecting((value) => !value)}
              />
            </div>

            <div className="pointer-events-auto flex items-center">
              <div role="group" aria-label="View" className="mr-2 hidden sm:flex">
                {(
                  [
                    ["3d", "3D view", icons.cube, "reset"],
                    ["plan", "Plan view", icons.plan, "plan"],
                    ["front", "Front view", icons.front, "front"],
                  ] as const
                ).map(([id, label, icon, kind], index) => (
                  <StageButton
                    key={id}
                    label={label}
                    icon={icon}
                    pressed={view === id}
                    onClick={() => move(kind)}
                    className={index > 0 ? "-ml-px" : undefined}
                  />
                ))}
              </div>
              <StageButton
                label={autoRotate ? "Stop turning" : "Turn slowly"}
                icon={icons.rotate}
                pressed={autoRotate}
                onClick={() => setAutoRotate((value) => !value)}
                className="mr-2 hidden sm:grid"
              />
              <StageButton label="Zoom out" icon={icons.minus} onClick={() => move("zoomOut")} />
              <StageButton label="Zoom in" icon={icons.plus} onClick={() => move("zoomIn")} className="-ml-px" />
              <StageButton label="Reset view" icon={icons.reset} onClick={() => move("reset")} className="-ml-px" />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Panel ---- */}
      <div className="relative flex flex-col border-line landscape-split:h-full landscape-split:min-h-0 landscape-split:border-l lg:h-full lg:min-h-0 lg:border-l">
        {/* Stepper */}
        <nav
          ref={stepperRef}
          aria-label="Builder steps"
          className="scroll-mt-[calc(max(44svh,18rem)+4rem)] border-b border-line px-4 py-4 sm:px-6"
        >
          <ol className="flex items-start">
            {STEPS.map((item, index) => {
              const current = index === stepIndex;
              const done = visited.has(item.id) && !current;
              return (
                <li key={item.id} className="relative flex flex-1 flex-col items-center">
                  {index > 0 ? (
                    <span
                      aria-hidden
                      className={cn(
                        "absolute right-1/2 top-3.5 h-px w-full -translate-y-1/2",
                        index <= stepIndex ? "bg-accent-text" : "bg-line",
                      )}
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={current ? "step" : undefined}
                    className="group relative flex flex-col items-center gap-1.5 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full border font-sans text-[0.6875rem] tabular-nums",
                        "transition-colors duration-(--duration-quick)",
                        "group-focus-visible:outline group-focus-visible:outline-[1.5px] group-focus-visible:outline-offset-2 group-focus-visible:outline-accent-text",
                        current
                          ? "border-accent-text bg-accent-text text-surface"
                          : done
                            ? "border-accent-text bg-surface text-accent-text"
                            : "border-line-strong bg-surface text-text-muted group-hover:border-text group-hover:text-text",
                      )}
                    >
                      {done ? <Icon path={icons.check} className="size-3.5" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        "hidden font-sans text-[0.625rem] uppercase tracking-[0.12em] sm:block",
                        current ? "text-text" : "text-text-muted",
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <div
          ref={panelRef}
          data-lenis-prevent
          className="relative flex-1 px-4 pb-8 pt-7 sm:px-6 landscape-split:min-h-0 landscape-split:overflow-y-auto lg:min-h-0 lg:overflow-y-auto"
        >
          <div key={step.id} className="animate-[builder-step_var(--duration-base)_var(--ease-out-soft)]">
            {stepBody[step.id]}
          </div>
        </div>

        {/* Back / next */}
        <div className="sticky bottom-0 z-30 flex items-center gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6 landscape-split:static lg:static lg:bg-surface">
          <button
            type="button"
            onClick={() => goTo(stepIndex - 1)}
            disabled={stepIndex === 0}
            className="inline-flex h-12 items-center gap-2 border border-line-strong px-4 font-sans text-meta uppercase text-text transition-colors duration-(--duration-quick) hover:border-text disabled:pointer-events-none disabled:opacity-35"
          >
            <Icon path={icons.arrowLeft} />
            Back
          </button>
          {next ? (
            <button
              type="button"
              onClick={() => goTo(stepIndex + 1)}
              className="group inline-flex h-12 flex-1 items-center justify-between gap-3 bg-accent px-5 font-sans text-meta uppercase text-cream transition-colors duration-(--duration-quick) hover:bg-emerald-deep"
            >
              <span>
                Next <span className="text-cream/70">· {next.label}</span>
              </span>
              <Icon
                path={icons.arrowRight}
                className="transition-transform duration-(--duration-base) ease-(--ease-out-soft) group-hover:translate-x-1"
              />
            </button>
          ) : (
            <a
              href="#quote-form"
              onClick={() => setSummaryTab("quote")}
              className="group inline-flex h-12 flex-1 items-center justify-between gap-3 bg-accent-text px-5 font-sans text-meta uppercase text-surface transition-colors duration-(--duration-quick) hover:bg-cream"
            >
              <span>
                Get my quote <span className="opacity-70">· {formatPrice(priced.total)}</span>
              </span>
              <Icon path={icons.arrowRight} className="rotate-90" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
