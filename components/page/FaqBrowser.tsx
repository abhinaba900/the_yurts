"use client";

import { useMemo, useState, useId } from "react";
import { cn } from "@/lib/cn";
import { Metadata } from "@/components/primitives/Metadata";

export type FaqGroup = {
  title: string;
  items: {
    id: string;
    question: string;
    /**
     * Rendered on the server and passed down as a node, so Portable Text never
     * has to cross into the client bundle.
     */
    answer?: React.ReactNode;
  }[];
};

/**
 * Searchable, categorised questions.
 *
 * The client boundary exists only for the search field. Expansion is a native
 * `<details>` element — it works before hydration, it is keyboard accessible
 * without any code, and it is findable by the browser's own in-page search.
 *
 * Questions with no answer render as plain text rather than as a control that
 * opens onto nothing.
 */
export function FaqBrowser({
  groups,
  answersPending,
}: {
  groups: FaqGroup[];
  /** True while answers are still being written, which changes the empty copy. */
  answersPending?: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.question.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const total = filtered.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      {/* Search */}
      <div className="u-grid items-end gap-y-6 border-t border-line pt-6">
        <div className="col-span-4 md:col-span-6 lg:col-span-6">
          <label
            htmlFor={inputId}
            className="font-sans text-meta uppercase text-text-muted"
          >
            Search questions
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Installation, monsoon, maintenance…"
            className={cn(
              "w-full border-0 border-b border-line bg-transparent pt-2 pb-3",
              "font-sans text-lead text-text placeholder:text-text-muted placeholder:opacity-60",
              "outline-none transition-colors duration-(--duration-quick)",
              "hover:border-line-strong focus:border-accent",
            )}
          />
        </div>
        <div className="col-span-4 md:col-span-6 lg:col-span-3 lg:col-start-10 lg:text-right">
          <p aria-live="polite" className="font-sans text-meta uppercase text-text-muted">
            {query.trim()
              ? `${total} ${total === 1 ? "question" : "questions"}`
              : `${total} questions`}
          </p>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="mt-16 u-measure font-sans text-lead text-text-muted">
          Nothing matches &ldquo;{query.trim()}&rdquo;. Ask us directly and we
          will answer it — and then add it here.
        </p>
      ) : (
        <div className="mt-16 space-y-16">
          {filtered.map((group) => (
            <section key={group.title}>
              <div className="u-grid">
                <div className="col-span-4 md:col-span-6 lg:col-span-3">
                  <div className="lg:sticky lg:top-32">
                    <Metadata as="h2" className="text-accent-text">
                      {group.title}
                    </Metadata>
                  </div>
                </div>

                <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
                  <ul className="divide-y divide-line">
                    {group.items.map((item) => (
                      <li key={item.id} className="border-t border-line last:border-b transition-colors duration-300">
                        <details className="group">
                          <summary
                            className={cn(
                              "flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 select-none",
                              "font-sans text-lead text-text transition-colors duration-300 hover:text-accent-text marker:hidden",
                              "[&::-webkit-details-marker]:hidden",
                            )}
                          >
                            <span className="group-open:text-accent-text group-open:font-medium transition-colors duration-300">
                              {item.question}
                            </span>
                            <span
                              aria-hidden
                              className="shrink-0 flex items-center justify-center size-6 text-xl font-light text-text-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45 group-open:text-accent-text"
                            >
                              +
                            </span>
                          </summary>
                          <div className="pb-6 pt-1 font-sans text-body text-text-muted leading-relaxed max-w-prose animate-in fade-in slide-in-from-top-1 duration-300">
                            {item.answer}
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
