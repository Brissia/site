/**
 * Single source of truth for identity, navigation and external links.
 * Empty strings are intentionally hidden in the UI until they are filled in.
 */
export const site = {
  name: "Brissia Benavente",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://brissiabenavente.com").replace(/\/$/, ""),
  locale: "en",
  roles: ["Digital Nomad", "Business Scientist", "Growth & Expansion Strategist"],
  statement: "Building better businesses across Latin America.",
  manifesto: "Critical thinking first, then everything else.",
  description:
    "Places, ideas and experiments by Brissia Benavente, a digital nomad and business scientist studying how technology, cities and human behavior shape growth across Latin America.",
  base: "La Paz, Bolivia",
  portrait: {
    src: "/images/portrait-terrace.jpg",
    alt: "Brissia Benavente seated on a terrace beside a glass wall, looking out over the hillsides of the city.",
    /** Which part of the photo stays visible when it is cropped. */
    position: "60% 8%",
  },
  /** Cut-out with transparent background, shown on the About page. */
  aboutPortrait: {
    src: "/images/portrait-reading.webp",
    alt: "Brissia Benavente reading on a tablet.",
    width: 1285,
    height: 1766,
  },
  social: {
    linkedin: "https://www.linkedin.com/in/brissiabenavente/",
    instagram: "https://www.instagram.com/brissiabenavente/",
    email: "brissia.benavente@gmail.com",
    calendar: "",
  },
  newsletterAction: process.env.NEXT_PUBLIC_NEWSLETTER_ACTION ?? "",
} as const;

/** Order and URLs of the menu. The labels, in both languages, live in src/i18n/dictionaries.ts under "nav". */
export const navigation = [
  { key: "nomading", href: "/nomading" },
  { key: "ideas", href: "/ideas" },
  { key: "experiments", href: "/experiments" },
  { key: "library", href: "/library" },
  { key: "journal", href: "/journal" },
  { key: "about", href: "/about" },
] as const;

/**
 * Homepage "Knowledge Domains". Each one resolves to a topic page or a section.
 * A /tags/<name> link needs at least one published piece with that tag; until
 * then, point it at /search?q=<name> as Fashion does.
 * Names and notes, in both languages, live in src/i18n/dictionaries.ts under "domains".
 */
export const domains = [
  { key: "growth", href: "/tags/growth" },
  { key: "ai", href: "/tags/ai" },
  { key: "nomading", href: "/nomading" },
  { key: "cities", href: "/tags/cities" },
  { key: "culture", href: "/tags/culture" },
  { key: "fashion", href: "/search?q=fashion" },
  { key: "thinking", href: "/ideas" },
  { key: "experiments", href: "/experiments" },
] as const;
