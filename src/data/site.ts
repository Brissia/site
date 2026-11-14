/**
 * Single source of truth for identity, navigation and external links.
 * Empty strings are intentionally hidden in the UI until they are filled in.
 */
export const site = {
  name: "Brissia Benavente",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://brissiabenavente.com").replace(/\/$/, ""),
  locale: "en",
  roles: ["Business Scientist", "Growth & Expansion Strategist"],
  statement: "Building better businesses across Latin America.",
  manifesto: "Critical thinking first, then everything else.",
  description:
    "Ideas, places and experiments by Brissia Benavente, a business scientist studying how technology, cities and human behavior shape growth across Latin America.",
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

/** Rename a label here and it changes everywhere. URLs stay stable. */
export const navigation = [
  { label: "Ideas", href: "/ideas" },
  { label: "Atlas", href: "/atlas" },
  { label: "Experiments", href: "/experiments" },
  { label: "Library", href: "/library" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
] as const;

/** Homepage "Knowledge Domains". Each one resolves to a tag or a section. */
export const domains = [
  { name: "Growth", note: "How businesses actually expand.", href: "/search?q=growth" },
  { name: "AI", note: "Tools that change how we decide.", href: "/search?q=ai" },
  { name: "Atlas", note: "Knowledge, placed on a map.", href: "/atlas" },
  { name: "Cities", note: "Territory as a business variable.", href: "/search?q=cities" },
  { name: "Culture", note: "Art, criticism and context.", href: "/search?q=culture" },
  { name: "Fashion", note: "What people choose to signal.", href: "/search?q=fashion" },
  { name: "Thinking", note: "Methods before opinions.", href: "/ideas" },
  { name: "Experiments", note: "Unfinished on purpose.", href: "/experiments" },
] as const;
