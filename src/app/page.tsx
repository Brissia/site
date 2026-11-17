import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowLink, ArticleCard, ArticleMeta, Chapter } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { PlaceCard } from "@/components/place-card";
import { Reveal } from "@/components/motion";
import { domains, site } from "@/data/site";
import { getArticles, getAtlasEntries, getJournalEntries, resolveLocation } from "@/lib/content";
import { formatDate, pad2 } from "@/utils/format";

const AtlasMap = dynamic(() => import("@/components/atlas-map"));

function Hero() {
  return (
    <section aria-label="Introduction" className="relative lg:grid lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12">
      <div className="shell-start relative z-10 flex flex-col justify-center pb-12 pt-14 md:pt-20 lg:col-span-6 lg:py-24 lg:pr-10">
        <h1 className="font-display text-[19vw] leading-[0.88] tracking-[-0.03em] sm:text-[7.5rem] lg:text-[clamp(5rem,8.2vw,9rem)]">
          Brissia
          <br />
          Benavente
        </h1>
        <div className="mt-8 text-lg leading-snug md:text-xl">
          {site.roles.map((role) => (
            <p key={role}>{role}</p>
          ))}
        </div>
        <span aria-hidden className="mt-8 block h-px w-14 bg-foreground" />
        <p className="mt-8 max-w-md font-display text-2xl italic leading-snug md:text-[1.75rem]">{site.manifesto}</p>
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

export default function HomePage() {
  const [featured, ...rest] = getArticles();
  const places = getAtlasEntries();
  const journal = getJournalEntries().slice(0, 3);
  // Stops with a photograph come first, then the most recent ones.
  const stops = [...places].sort((a, b) => Number(b.photos.length > 0) - Number(a.photos.length > 0)).slice(0, 3);
  const countries = new Set(places.map((p) => p.country)).size;

  return (
    <>
      <Hero />

      {places.length > 0 && (
        <Chapter
          id="nomading"
          number={1}
          title="Nomading"
          lead={`${places.length} places in ${countries} countries so far. A photograph, a sentence and a date from each stop.`}
          link={{ label: "See every stop", href: "/nomading" }}
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
                      dateLabel: p.visitedDate ? formatDate(p.visitedDate) : undefined,
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
          title="Ideas"
          lead="Essays and research on cities, technology, business and what comes next."
          link={{ label: "Browse all ideas", href: "/ideas" }}
        >
          <Reveal>
            <ArticleCard article={featured} featured />
          </Reveal>
          {rest.length > 0 && (
            <ul className="mt-12 md:mt-16">
              {rest.slice(0, 3).map((a) => (
                <li key={a.slug} lang={a.language} className="border-t border-border">
                  <Link href={a.url} className="group grid gap-2 py-6 md:grid-cols-9 md:gap-6">
                    <div className="md:col-span-3 md:pt-1.5">
                      <ArticleMeta article={a} />
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

      <Chapter id="domains" number={3} title="Domains" lead="The territories this site keeps returning to. Each one is a way in.">
        <ul className="grid grid-cols-2 border-l border-t border-border md:grid-cols-4">
          {domains.map((d, i) => (
            <li key={d.name} className="border-b border-r border-border">
              <Link
                href={d.href}
                className="group flex aspect-square flex-col justify-between p-4 transition-colors duration-200 ease-out hover:bg-hover md:p-5"
              >
                <span className="meta">{pad2(i + 1)}</span>
                <span>
                  <span className="block font-display text-[1.65rem] leading-none tracking-tight md:text-3xl">{d.name}</span>
                  <span className="mt-2 block text-[13px] leading-snug text-muted">{d.note}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Chapter>

      {journal.length > 0 && (
        <Chapter
          id="journal"
          number={4}
          title="Journal"
          lead="Short notes. Never more than three hundred words."
          link={{ label: "Read the journal", href: "/journal" }}
        >
          <ul className="grid gap-x-6 md:grid-cols-3">
            {journal.map((entry, i) => {
              const place = resolveLocation(entry.location);
              return (
                <li key={entry.slug} lang={entry.language} className="border-t border-border py-6 md:py-0 md:pt-6">
                  <Reveal delay={i * 0.06}>
                    <p className="meta">
                      <time dateTime={entry.date}>{formatDate(entry.date)}</time>
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
        <ArrowLink href="/about">About Brissia</ArrowLink>
      </div>
    </>
  );
}
