import { getDictionary, type Lang } from "@/i18n";

/**
 * "2026-10-20" becomes "OCT 20, 2026", "2026-10" becomes "OCT 2026" and "2026" stays "2026",
 * so a place can carry the date as precisely as it is remembered.
 * Parsed by hand to avoid timezone drift.
 */
export function formatDate(iso: string, lang: Lang = "en"): string {
  const months = getDictionary(lang).months;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (y && m && !d && months[m - 1]) return `${months[m - 1]} ${y}`;
  if (!y || !m || !d) return iso;
  const day = String(d).padStart(2, "0");
  return lang === "es" ? `${day} ${months[m - 1]} ${y}` : `${months[m - 1]} ${day}, ${y}`;
}

export function formatCoordinates([lat, lng]: [number, number]): string {
  const f = (v: number, pos: string, neg: string) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? pos : neg}`;
  return `${f(lat, "N", "S")}, ${f(lng, "E", "W")}`;
}

export function countWords(text: string): number {
  return text
    .replace(/[#>*_`\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** "Métricas de Growth" becomes "metricas-de-growth". Tags that differ only by case or accents share a page. */
export function tagSlug(tag: string): string {
  return tag
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
