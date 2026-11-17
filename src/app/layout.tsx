import type { ReactNode } from "react";

/**
 * The document itself (<html>, fonts, header, footer) is rendered by
 * src/app/[lang]/layout.tsx, because the language decides the lang attribute.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
