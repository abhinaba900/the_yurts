import { DM_Sans, Instrument_Serif } from "next/font/google";

/**
 * Two typefaces. That is the whole system.
 * Instrument Serif carries every display line; DM Sans carries everything else.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  axes: ["opsz"],
});
