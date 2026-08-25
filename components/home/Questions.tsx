"use client";

import { useState } from "react";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { cn } from "@/lib/cn";

const homeFaqs = [
  {
    topic: "Cost",
    question: "How much does a yurt cost to manufacture and build?",
    answer:
      "A complete yurt structure ranges from ₹14L to ₹28L depending on diameter (5m–10m+), glass French door openings, insulation grade, and interior finishes. Compared to permanent brick-and-mortar hotel suites, yurts typically deliver a 50–60% Capex reduction.",
  },
  {
    topic: "Installation",
    question: "How long does on-site assembly and installation take?",
    answer:
      "Because every lattice wall, rafter, and crown is 100% pre-machined in our workshop, our installation crew can assemble and fully enclose a yurt on your prepared base in just 3 to 4 days.",
  },
  {
    topic: "Site preparation",
    question: "What groundworks or site preparation are required?",
    answer:
      "Yurts require zero heavy excavation or deep concrete sumps. They sit on an elevated timber platform supported by removable helical ground screws or minimal stone piers, leaving the natural ground untouched.",
  },
  {
    topic: "Indian climate",
    question: "Will a yurt handle extreme heat and sub-zero cold in India?",
    answer:
      "Yes. Our structures feature dense natural thermal wool insulation and radiant heat barriers, keeping interiors comfortable in -15°C Himalayan winter snows and 45°C arid summers.",
  },
  {
    topic: "Monsoon",
    question: "How does the structure perform during heavy torrential monsoons?",
    answer:
      "The steep conical roof naturally sheds torrential water, while our heavy-duty breathable organic canvas with 10,000mm hydrostatic head prevents water ingress and resists mold/mildew.",
  },
  {
    topic: "Customisation",
    question: "What elements can be tailored to our project?",
    answer:
      "Everything from diameters (5m–12m+), double-glazed panoramic glass windows, solid timber doors, partition walls for luxury ensuites, and bespoke flooring finishes.",
  },
  {
    topic: "Maintenance & Lifespan",
    question: "What is the lifespan and maintenance routine?",
    answer:
      "The steam-bent ash timber framework has a 30–50+ year structural lifespan. The outer canvas membrane lasts 10–15 years and can be replaced in a single day. Maintenance involves simple annual cleaning.",
  },
  {
    topic: "Transportation & Permissions",
    question: "How are components delivered, and what permits apply?",
    answer:
      "The frame folds completely flat and is transported by standard truck across India. In most states, yurts qualify as non-permanent modular accommodation, simplifying eco-tourism zoning clearances.",
  },
];

const topicsList = [
  "Cost",
  "Installation",
  "Site preparation",
  "Indian climate",
  "Monsoon",
  "Customisation",
  "Maintenance",
  "Lifespan",
  "Transportation",
  "Delivery",
  "Permissions",
  "Installation locations",
];

/**
 * 15. FAQ
 *
 * Heading: Before you build one.
 * Questions around: Cost, Installation, Site preparation, Indian climate, Monsoon, Customisation, Maintenance, Lifespan, Transportation, Delivery, Permissions, Installation locations.
 * Link: See all questions →
 */
export function Questions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="u-container py-16 lg:py-20 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-t border-line pt-8">
        <div>
          <Reveal kind="up">
            <Metadata className="text-accent-text">Frequently Asked Questions</Metadata>
            <h2 className="mt-2 font-display text-display-lg u-optical-left">
              Before you build one.
            </h2>
          </Reveal>
        </div>
        <Reveal kind="up" delay={0.08} className="max-w-md">
          <p className="font-sans text-small text-text-muted">
            Key questions regarding engineering, site readiness, climate
            resilience, permissions and installation across India.
          </p>
        </Reveal>
      </div>

      {/* Topic Chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {topicsList.map((t) => (
          <span
            key={t}
            className="rounded-xs border border-line/60 bg-surface-alt/40 px-2.5 py-1 font-sans text-meta uppercase text-[0.625rem] text-text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Accordion Grid */}
      <div className="mt-8 lg:mt-10 grid gap-x-12 lg:grid-cols-2 items-start">
        {homeFaqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <Reveal
              key={faq.question}
              kind="up"
              delay={Math.min(i, 4) * 0.03}
              className="border-t border-line py-3"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-baseline justify-between gap-4 text-left py-2 group focus:outline-none cursor-pointer"
              >
                <span className="flex items-baseline gap-3 flex-1">
                  <span
                    className={cn(
                      "font-sans text-meta uppercase transition-colors duration-300",
                      isOpen ? "text-accent-text font-semibold" : "text-text-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-lead transition-colors duration-300",
                      isOpen
                        ? "text-accent-text font-medium"
                        : "text-text group-hover:text-accent-text",
                    )}
                  >
                    {faq.question}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 flex items-center justify-center size-6 text-xl font-light transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isOpen
                      ? "rotate-45 text-accent-text"
                      : "text-text-muted group-hover:text-text",
                  )}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div className="pl-8 pr-4 pb-4 pt-1 font-sans text-body text-text-muted leading-relaxed text-small sm:text-body animate-in fade-in slide-in-from-top-1 duration-300">
                  {faq.answer}
                </div>
              )}
            </Reveal>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="mt-10 border-t border-line pt-6 flex items-center justify-between">
        <ArrowLink href="/faq">See all questions</ArrowLink>
        <span className="font-sans text-meta uppercase text-text-muted text-xs">
          Comprehensive Architectural & Commercial FAQ
        </span>
      </div>
    </section>
  );
}
