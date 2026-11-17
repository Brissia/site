import dynamic from "next/dynamic";
import Image from "next/image";
import { Link } from "@/components/link";
import { ArrowLink, ArticleCard, ArticleMeta, Chapter } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { PlaceCard } from "@/components/place-card";
import { Reveal } from "@/components/motion";
import { domains, site } from "@/data/site";
import { getDictionary, toLang, type Lang } from "@/i18n";
import { getArticles, getAtlasEntries, getExperiments, getJournalEntries, resolveLocation } from "@/lib/content";
import { formatDate, pad2 } from "@/utils/format";

const AtlasMap = dynamic(() => import("@/components/atlas-map"));

function Hero({ lang }: { lang: Lang }) {
  return (
    <section aria-label={getDictionary(lang).home.intro} className="relative lg:grid lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12">
      <div className="shell-start relative z-10 flex flex-col justify-center pb-12 pt-14 md:pt-20 lg:col-span-6 lg:py-24 lg:pr-10">
        <h1 className="font-display text-[19vw] leading-[0.88] tracking-[-0.03em] sm:text-[7.5rem] lg:text-[clamp(5rem,8.2vw,9rem)]">
          Brissia
          <br />
          Benavente
        </h1>
        <div className="mt-8 text-lg leading-snug md:text-xl">
          {getDictionary(lang).hero.roles.map((role) => (
            <p key={role}>{role}</p>
          ))}
        </div>
        <span aria-hidden className="mt-8 block h-px w-14 bg-foreground" />
        <p className="mt-8 max-w-md font-display text-2xl italic leading-snug md:text-[1.75rem]">{getDictionary(lang).hero.manifesto}</p>
      </div>

      {/* Desktop: the photograph runs wider than its column and dissolves into the page on the left.
          It is a mask, not a color overlay, so it works on any background and in both themes. */}
      <div
        className={`relative aspect-[4/5] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[60%] ${
          site.portrait.src
            ? "lg:[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_16%,black_42%)]"
            : "bg-card"
        }`}
      >
        {site.portrait.src ? (
          <Image
            src={site.portrait.src}
            alt={site.portrait.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover grayscale"
            style={{ objectPosition: site.portrait.position }}
          />
        ) : (
          <div className="absolute inset-0 flex items-end border-y border-border p-6 lg:border-y-0 lg:border-l">
            <p className="meta max-w-[16rem]">Portrait. Black and white, natural light, not looking at the camera.</p>
          </div>
        )}
      </div>
    </section>
  );
}

type Props = { params: Promise<{ lang: string }> };

export default async function HomePage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const [featured, ...rest] = getArticles(lang);
  const places = getAtlasEntries(lang);
  const journal = getJournalEntries(lang).slice(0, 3);
  // Experiments marked "featured: true". The chapter stays hidden until there is one.
  const projects = getExperiments(lang).filter((e) => e.featured).slice(0, 3);
  // Stops with a photograph come first, then the most recent ones. Entries still holding sample text stay off the homepage.
  const stops = places
    .filter((p) => !p.notes.startsWith("Sample"))
    .sort((a, b) => Number(b.photos.length > 0) - Number(a.photos.length > 0))
    .slice(0, 3);
  const countries = new Set(places.map((p) => p.country)).size;

  return (
    <>
      <Hero lang={lang} />

      {places.length > 0 && (
        <Chapter
          id="nomading"
          number={1}
          lang={lang}
          title={t.nav.nomading}
          lead={t.home.nomadingLead(places.length, countries)}
          link={{ label: t.home.seeStops, href: "/nomading" }}
        >
          <AtlasMap
            places={places.map(({ slug, city, country, coordinates, notes, url }) => ({ slug, city, country, coordinates, notes, url }))}
            className="h-[22rem] lg:h-[28rem]"
          />
          <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-3">
            {stops.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * 0.06}>
                  <PlaceCard
                    place={{
                      slug: p.slug,
                      city: p.city,
                      country: p.country,
                      notes: p.notes,
                      url: p.url,
                      photo: p.photos[0],
                      dateLabel: p.visitedDate ? formatDate(p.visitedDate, lang) : undefined,
                    }}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </Chapter>
      )}

      {featured && (
        <Chapter
          id="latest-essay"
          number={2}
          lang={lang}
          title={t.nav.ideas}
          lead={t.home.ideasLead}
          link={{ label: t.home.browseIdeas, href: "/ideas" }}
        >
          <Reveal>
            <ArticleCard article={featured} featured lang={lang} />
          </Reveal>
          {rest.length > 0 && (
            <ul className="mt-12 md:mt-16">
              {rest.slice(0, 3).map((a) => (
                <li key={a.slug} lang={a.language} className="border-t border-border">
                  <Link href={a.url} className="group grid gap-2 py-6 md:grid-cols-9 md:gap-6">
                    <div className="md:col-span-3 md:pt-1.5">
                      <ArticleMeta article={a} lang={lang} />
                    </div>
                    <div className="md:col-span-6">
                      <h3 className="font-display text-[1.75rem] leading-[1.1] tracking-tight">
                        <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{a.title}</span>
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Chapter>
      )}

      <Chapter id="expertise" number={3} lang={lang} title={t.expertise.title} lead={t.expertise.lead}>
        <ul className="grid gap-x-6 md:grid-cols-3">
          {(
            [
              { href: "/companies", name: t.nav.companies, note: t.expertise.companies },
              { href: "/people", name: t.nav.people, note: t.expertise.people },
              { href: "/toolkit", name: t.nav.toolkit, note: t.expertise.toolkit },
            ] as const
          ).map((entry, i) => (
            <li key={entry.href} className="border-t border-border py-6 md:py-0 md:pt-6">
              <Reveal delay={i * 0.06}>
                <Link href={entry.href} className="group block">
                  <span className="meta">{pad2(i + 1)}</span>
                  <span className="mt-3 block font-display text-3xl leading-none tracking-tight md:text-4xl">
                    <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{entry.name}</span>
                  </span>
                  <span className="mt-3 block text-[15px] leading-relaxed text-muted">{entry.note}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter id="domains" number={4} lang={lang} title={t.home.domains} lead={t.home.domainsLead} link={{ label: t.graph.link, href: "/graph" }}>
        <ul className="grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
          {domains.map((d, i) => (
            <li key={d.key} className="border-b border-r border-border">
              <Link
                href={d.href}
                className="group flex aspect-square flex-col justify-between p-4 transition-colors duration-200 ease-out hover:bg-hover md:p-5"
              >
                <span className="meta">{pad2(i + 1)}</span>
                <span>
                  <span className="block font-display text-[1.65rem] leading-none tracking-tight md:text-3xl">{t.domains[d.key].name}</span>
                  <span className="mt-2 block text-[13px] leading-snug text-muted">{t.domains[d.key].note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Chapter>

      {projects.length > 0 && (
        <Chapter
          id="projects"
          number={5}
          lang={lang}
          title={t.projects.title}
          lead={t.projects.lead}
          link={{ label: t.projects.all, href: "/experiments" }}
        >
          <ul className="grid gap-x-6 md:grid-cols-3">
            {projects.map((project, i) => (
              <li key={project.slug} className="border-t border-border py-6 md:py-0 md:pt-6">
                <Reveal delay={i * 0.06}>
                  <p className="meta">
                    {project.category} · {t.experiments.statuses[project.status] ?? project.status}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight">
                    <Link href={project.url} className="link-quiet decoration-transparent hover:decoration-foreground">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{project.description}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Chapter>
      )}

      {journal.length > 0 && (
        <Chapter
          id="journal"
          number={projects.length > 0 ? 6 : 5}
          lang={lang}
          title={t.nav.journal}
          lead={t.home.journalLead}
          link={{ label: t.home.readJournal, href: "/journal" }}
        >
          <ul className="grid gap-x-6 md:grid-cols-3">
            {journal.map((entry, i) => {
              const place = resolveLocation(entry.location, lang);
              return (
                <li key={entry.slug} lang={entry.language} className="border-t border-border py-6 md:py-0 md:pt-6">
                  <Reveal delay={i * 0.06}>
                    <p className="meta">
                      <time dateTime={entry.date}>{formatDate(entry.date, lang)}</time>
                      {place && <span> · {place.label}</span>}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-tight tracking-tight">
                      <Link href={entry.url} className="link-quiet decoration-transparent hover:decoration-foreground">
                        {entry.title}
                      </Link>
                    </h3>
                    <Mdx source={entry.body} className="mt-3 !text-[15px] !leading-relaxed [&_p]:!my-0 [&_p]:text-muted" />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </Chapter>
      )}

      <div className="shell pb-16 lg:hidden">
        <ArrowLink href="/about">{t.home.about}</ArrowLink>
      </div>
    </>
  );
}
