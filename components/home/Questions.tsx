"use client";

import { useState } from "react";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { cn } from "@/lib/cn";

const homeFaqs = [
  {
    question: "How is a yurt built, and what is it made of?",
    answer:
      "A yurt is formed by expanding steam-bent hardwood lattice walls into a circle, tensioning a perimeter steel cable, and locking roof rafters into a central timber crown. The frame is sheathed in breathable wool felt insulation and a heavy-duty weatherproof canvas skin.",
  },
  {
    question: "What does the site need to be ready for one?",
    answer:
      "The site simply needs clear pedestrian access and a reasonably level footprint. Yurts sit on discrete, reversible timber platform decks or ground screws without requiring deep concrete foundations or excavation.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Once the platform deck is in place, standard yurt structures (5m–8m diameter) are assembled, fully enclosed, and sealed in just 2 to 4 days.",
  },
  {
    question: "How does it handle monsoon, heat and wind?",
    answer:
      "The steep conical roof and 10,000mm hydrostatic head canvas shed torrential monsoon downpours, while the circular profile disperses 120 km/h wind gusts. The operable crown skylight provides natural stack-ventilation during hot summers.",
  },
  {
    question: "What can be customised?",
    answer:
      "Diameters from 5m to 10m+, French glass double doors, bespoke window placements, luxury ensuite partitions, canvas colors, and personalized interior timber finishes.",
  },
  {
    question: "How is it maintained, and how long does it last?",
    answer:
      "Solid hardwood timber frames last 30–50+ years. The outer canvas membrane lasts 10–15+ years and is easily replaced in a day. Maintenance involves simple annual cleaning and periodic canvas re-proofing.",
  },
  {
    question: "Can it be moved once it is up?",
    answer:
      "Yes, 100% of the structure is demountable. It can be unbolted in 1–2 days, packed flat into transport crates, and rebuilt on a new site without material loss or site damage.",
  },
  {
    question: "Where in India do you deliver and install?",
    answer:
      "We deliver and provide certified on-site installation across all Indian states — from Himalayan hill stations and Rajasthan deserts to southern coastlines and Western Ghats retreats.",
  },
];

/**
 * Common questions section.
 *
 * Prominent, user-friendly interactive accordion layout:
 * Left column: Section header and direct inquiry callout.
 * Right column: Smooth interactive accordion items with visible answers.
 */
export function Questions() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="u-container py-14 lg:py-10 lg:min-h-[calc(100vh-6rem)] lg:flex lg:flex-col lg:justify-center overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4 border-t border-line pt-8">
        <div>
          <Reveal kind="up">
            <Metadata className="text-accent-text">Common Questions</Metadata>
            <h2 className="mt-2 font-display text-display-lg u-optical-left">
              What people ask.
            </h2>
          </Reveal>
        </div>
        <Reveal kind="up" delay={0.08} className="max-w-md">
          <p className="font-sans text-small text-text-muted">
            Direct answers on construction, site preparation, weather resistance,
            and installation across India.
          </p>
        </Reveal>
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
                className="w-full flex items-baseline justify-between gap-4 text-left py-2 group focus:outline-none"
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
      <div className="mt-8 border-t border-line pt-6 flex items-center justify-between">
        <ArrowLink href="/faq">All 34 questions & answers</ArrowLink>
        <span className="font-sans text-meta uppercase text-text-muted">
          08 Key Topics
        </span>
      </div>
    </section>
  );
}
