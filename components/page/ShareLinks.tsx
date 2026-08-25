"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Share links.
 *
 * Plain anchors to each network's share endpoint — no third-party embeds, no
 * tracking scripts, and nothing that loads before someone chooses to share.
 * Only "copy link" needs JavaScript, and it degrades to doing nothing visible
 * rather than breaking the row.
 */
export function ShareLinks({ path, title }: { path: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const url = new URL(path, site.url).toString();

  const targets = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked. The other share targets still work.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
      <span className="font-sans text-meta uppercase text-text-muted">Share</span>

      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noreferrer"
          className="font-sans text-meta uppercase text-text transition-colors duration-(--duration-quick) hover:text-accent-text"
        >
          {target.label}
        </a>
      ))}

      <button
        type="button"
        onClick={copy}
        className="font-sans text-meta uppercase text-text transition-colors duration-(--duration-quick) hover:text-accent-text"
      >
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
