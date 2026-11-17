import { Connected } from "@/components/connected";
import { PageIntro } from "@/components/editorial";
import { Link } from "@/components/link";
import { Mdx } from "@/components/mdx";
import { getDictionary, type Lang } from "@/i18n";
import { getPage, getToolkitItems, resolveRefs } from "@/lib/content";

interface Testimonial {
  name: string;
  country?: string;
  quote: string;
}

/**
 * Companies and People share one layout: the text as written, the tools that go with it,
 * what has been published on the subject and, when there are any, the words of those who went through it.
 * It describes a way of working. There is no pricing and no button asking for anything.
 */
export function ExpertisePage({ name, lang }: { name: "companies" | "people"; lang: Lang }) {
  const t = getDictionary(lang);
  const page = getPage(name, lang);
  const language = typeof page.data.language === "string" ? page.data.language : page.language;
  const tools = getToolkitItems().filter((item) => item.audience === name);
  const writing = resolveRefs(Array.isArray(page.data.related) ? (page.data.related as string[]) : []);
  const testimonials = (Array.isArray(page.data.testimonials) ? page.data.testimonials : []) as Testimonial[];

  return (
    <>
      <PageIntro label={t.expertise.title} title={t.nav[name]} lead={name === "companies" ? t.expertise.companiesLead : t.expertise.peopleLead} />
      <div className="shell grid gap-14 border-t border-border py-12 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div lang={language} className="lg:col-span-7">
          <Mdx source={page.body} className="[&>h2:first-child]:!mt-0 [&_h2]:!mt-16 [&_h2]:!text-4xl [&_h3]:!text-2xl" />
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          {tools.length > 0 && (
            <section aria-labelledby="resources">
              <h2 id="resources" className="meta">
                {t.expertise.resources}
              </h2>
              <ul className="mt-2">
                {tools.map((tool) => (
                  <li key={tool.slug} lang={tool.language} className="border-b border-border">
                    <Link href={tool.url} className="group block py-4">
                      <span className="font-display text-2xl leading-tight tracking-tight">
                        <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{tool.title}</span>
                      </span>
                      <span className="mt-1 block text-[14px] leading-relaxed text-muted">{tool.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Connected items={writing} title={t.expertise.writing} id="writing" lang={lang} />
        </aside>
      </div>

      {testimonials.length > 0 && (
        <section aria-labelledby="testimonials" className="border-t border-border">
          <div className="shell py-16 md:py-24">
            <h2 id="testimonials" className="meta">
              {t.expertise.testimonials}
            </h2>
            <ul lang={language} className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {testimonials.map((item) => (
                <li key={item.name}>
                  <figure>
                    <blockquote className="font-display text-xl italic leading-snug md:text-2xl">&ldquo;{item.quote}&rdquo;</blockquote>
                    <figcaption className="meta mt-5">
                      {item.name}
                      {item.country && <> · {item.country}</>}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            {page.data.testimonialsTranslated === true && <p className="meta mt-10">{t.expertise.translated}</p>}
          </div>
        </section>
      )}
    </>
  );
}
