import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge cannot tell a custom font-size (`text-meta`) from a custom
 * text colour (`text-text-muted`) — it assumes both are colours and silently
 * drops the first. Every custom key in the theme is declared here so merging
 * resolves correctly.
 *
 * If you add a token to tokens.css, add it here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "lead",
            "body",
            "small",
            "meta",
            "numeral",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "text",
            "text-muted",
            "surface",
            "surface-alt",
            "surface-deep",
            "accent",
            "accent-text",
            "line",
            "line-strong",
          ],
        },
      ],
      "font-family": [{ font: ["display", "sans"] }],
      aspect: [
        {
          aspect: ["portrait", "editorial", "landscape", "cinema", "panorama"],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
