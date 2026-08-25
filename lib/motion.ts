/**
 * MOTION RULES
 *
 * Three durations, three curves — mirrored exactly from tokens.css so JS and CSS
 * animations never drift apart.
 *
 * The rules:
 *   1. Motion serves storytelling, hierarchy or interaction. Otherwise remove it.
 *   2. Nothing moves more than 24px. Big travel reads as a template.
 *   3. Nothing loops. No floating, no pulsing, no ambient drift.
 *   4. Reveals fire once, never on scroll-back.
 *   5. prefers-reduced-motion is handled globally in base.css AND here.
 */

export const ease = {
  outSoft: [0.22, 1, 0.36, 1],
  inOutSoft: [0.65, 0, 0.35, 1],
  reveal: [0.16, 1, 0.3, 1],
} as const;

export const duration = {
  quick: 0.2,
  base: 0.45,
  slow: 0.9,
} as const;

/** Standard viewport trigger: fire once, slightly before the element is centred. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Text and small block reveal — the default for editorial copy. */
export const revealUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.reveal },
  },
} as const;

/** Media reveal — the image scales down into place behind a clip, never fades alone. */
export const revealMedia = {
  hidden: { opacity: 0, clipPath: "inset(12% 0% 0% 0%)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: duration.slow, ease: ease.reveal },
  },
} as const;

/** Parent for staggered children. Stagger stays under 80ms — slower reads as a demo. */
export const stagger = (amount = 0.06, delay = 0) =>
  ({
    hidden: {},
    visible: { transition: { staggerChildren: amount, delayChildren: delay } },
  }) as const;
