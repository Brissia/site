import localFont from "next/font/local";

/**
 * Two families plus mono, as the Design System requires.
 * Swap the files in src/fonts to change typefaces (see src/fonts/README.md).
 */
export const display = localFont({
  src: [
    { path: "../fonts/newsreader-latin-wght-normal.woff2", style: "normal", weight: "200 800" },
    { path: "../fonts/newsreader-latin-wght-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const sans = localFont({
  src: [{ path: "../fonts/inter-latin-wght-normal.woff2", style: "normal", weight: "100 900" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const mono = localFont({
  src: [{ path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", style: "normal", weight: "400" }],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});
