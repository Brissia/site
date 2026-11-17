import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { getDictionary, type Lang } from "@/i18n";

export function Newsletter({ lang = "en" }: { lang?: Lang }) {
  const t = getDictionary(lang).footer;
  const enabled = Boolean(site.newsletterAction);
  return (
    <section aria-labelledby="newsletter-title" className="border-t border-border">
      <div className="shell grid gap-8 py-16 md:grid-cols-2 md:items-end md:py-24">
        <div>
          <h2 id="newsletter-title" className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            {t.title}
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            {t.text}
          </p>
        </div>
        <form action={site.newsletterAction || undefined} method="post" target="_blank" className="w-full md:justify-self-end md:max-w-md">
          <fieldset disabled={!enabled} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              {t.emailLabel}
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.placeholder}
              className="h-12 w-full shrink-0 rounded-none sm:flex-1 sm:shrink border border-border bg-transparent px-4 text-[15px] transition-colors duration-200 ease-out placeholder:text-muted hover:border-muted focus:border-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="h-12 shrink-0 bg-foreground px-6 text-[14px] font-medium text-background transition-opacity duration-200 ease-out hover:opacity-85 disabled:opacity-40"
            >
              {t.subscribe}
            </button>
          </fieldset>
          {!enabled && <p className="meta mt-3">{t.soon}</p>}
        </form>
      </div>
    </section>
  );
}

export function Footer({ lang = "en" }: { lang?: Lang }) {
  const t = getDictionary(lang);
  const links = [
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "Instagram", href: site.social.instagram },
    { label: t.footer.email, href: site.social.email ? `mailto:${site.social.email}` : "" },
    { label: t.footer.calendar, href: site.social.calendar },
  ].filter((l) => l.href);
  return (
    <footer className="print:hidden">
      <Newsletter lang={lang} />
      <div className="border-t border-border">
        <div className="shell flex flex-col gap-6 py-8 text-[13px] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            {site.name} &copy; {new Date().getFullYear()}
          </p>
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} rel="me noopener" className="transition-colors duration-200 ease-out hover:text-foreground">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <a href="#top" className="inline-flex items-center gap-2 transition-colors duration-200 ease-out hover:text-foreground">
            <ArrowUp aria-hidden strokeWidth={1.25} className="size-4" />
            {t.common.backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
