import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { getDictionary, type Lang } from "@/i18n";
import { NewsletterForm } from "./newsletter-form";

export function Newsletter({ lang = "en" }: { lang?: Lang }) {
  const t = getDictionary(lang).footer;
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
        <div className="w-full md:max-w-md md:justify-self-end">
          <NewsletterForm lang={lang} idPrefix="newsletter" />
        </div>
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
