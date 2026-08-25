import { Instrument_Serif, Inter } from "next/font/google";

/**
 * Two typefaces. That is the whole system.
 * Instrument Serif carries every display line; Inter carries everything else.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  axes: ["opsz"],
});
