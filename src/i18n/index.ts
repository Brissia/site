/**
 * Interface languages. English lives at the root ("/ideas"), Spanish under "/es" ("/es/ideas").
 * Only the interface is translated: every piece of content stays in the language it was written in.
 * To change a word anywhere on the site, edit src/i18n/dictionaries.ts.
 */
export const languages = ["en", "es"] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = "en";

export const isLang = (value: unknown): value is Lang => value === "en" || value === "es";
export const toLang = (value: unknown): Lang => (isLang(value) ? value : defaultLang);

/** "/ideas" stays "/ideas" in English and becomes "/es/ideas" in Spanish. External links and anchors pass through. */
export function localize(href: string, lang: Lang): string {
  if (lang === defaultLang || !href.startsWith("/") || href.startsWith("//")) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

/** The same page in the other language, from the path shown in the browser. */
export function switchLanguagePath(pathname: string, to: Lang): string {
  const bare = pathname.replace(/^\/es(?=\/|$)/, "") || "/";
  return localize(bare, to);
}

export { getDictionary, type Dictionary } from "./dictionaries";
