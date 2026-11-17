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

/** Rename a label here and it changes everywhere. URLs stay stable. */
export const navigation = [
  { label: "Nomading", href: "/nomading" },
  { label: "Ideas", href: "/ideas" },
  { label: "Experiments", href: "/experiments" },
  { label: "Library", href: "/library" },
  { label: "Journal", href: "/journal" },
  { label: "About", href: "/about" },
] as const;

/**
 * Homepage "Knowledge Domains". Each one resolves to a topic page or a section.
 * A /tags/<name> link needs at least one published piece with that tag; until
 * then, point it at /search?q=<name> as Fashion does.
 */
export const domains = [
  { name: "Growth", note: "How businesses actually expand.", href: "/tags/growth" },
  { name: "AI", note: "Tools that change how we decide.", href: "/tags/ai" },
  { name: "Nomading", note: "A life lived between cities.", href: "/nomading" },
  { name: "Cities", note: "Territory as a business variable.", href: "/tags/cities" },
  { name: "Culture", note: "Art, criticism and context.", href: "/tags/culture" },
  { name: "Fashion", note: "What people choose to signal.", href: "/search?q=fashion" },
  { name: "Thinking", note: "Methods before opinions.", href: "/ideas" },
  { name: "Experiments", note: "Unfinished on purpose.", href: "/experiments" },
] as const;
