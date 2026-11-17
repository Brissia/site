import Link from "next/link";
import { notFound } from "next/navigation";
import AtlasMap from "@/components/atlas-map";
import { Connected, TagList } from "@/components/connected";
import { ArrowLink, Cover, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { getAtlasEntries, getAtlasEntry, getConnections, getContentForPlace, tagsOf } from "@/lib/content";
import { pageMetadata, placeSchema } from "@/lib/seo";
import { formatCoordinates, formatDate } from "@/utils/format";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getAtlasEntries().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props) {
  const place = getAtlasEntry((await params).slug);
  if (!place) return {};
  return pageMetadata({ title: `${place.city}, ${place.country}`, description: place.notes, path: place.url, image: place.photos[0] });
}

export default async function PlacePage({ params }: Props) {
  const place = getAtlasEntry((await params).slug);
  if (!place) notFound();
  const { articles, journal } = getContentForPlace(place.slug);
  // Ideas and notes have their own lists below; this is everything else tied to the place.
  const listed = new Set([...articles, ...journal].map((c) => c.url));
  const connections = getConnections(place).filter((c) => !listed.has(c.url));

  const [lead, ...gallery] = place.photos;
  // Many entries are only their sentence, already set large in the header. Longer notes show below.
  const notes = place.body.replace(/[*_"\u201c\u201d]/g, "").trim() !== place.notes.trim() && place.body;
  const map = (
    <AtlasMap
      focus
      places={[{ slug: place.slug, city: place.city, country: place.country, coordinates: place.coordinates, notes: place.notes, url: place.url }]}
      className={lead ? "h-64" : "h-72 md:h-[26rem]"}
    />
  );

  return (
    <article>
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <p className="meta">
          Nomading
          {place.visitedDate && (
            <>
              {" · "}
              <time dateTime={place.visitedDate}>{formatDate(place.visitedDate)}</time>
            </>
          )}
          {" · "}
          {formatCoordinates(place.coordinates)}
        </p>
        <h1 className="mt-4 font-display text-[3.5rem] leading-[0.95] tracking-tight md:text-8xl">
          {place.city}
          <span className="block text-muted md:inline">
            <span className="hidden md:inline">, </span>
            {place.country}
          </span>
        </h1>
        <p className="mt-8 max-w-2xl font-display text-2xl italic leading-snug md:text-3xl">&ldquo;{place.notes}&rdquo;</p>
      </header>

      {/* The photograph leads. Without one, the map takes its place. */}
      {lead ? (
        <div className="shell">
          <Cover src={lead} alt={`${place.city}, ${place.country}`} priority ratio="aspect-[4/5] md:aspect-[16/9]" sizes="100vw" />
        </div>
      ) : (
        <div className="shell">{map}</div>
      )}

      <div className="shell grid gap-14 py-14 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          {notes && <Mdx source={place.body} />}
          {gallery.length > 0 && (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {gallery.map((src) => (
                <li key={src}>
                  <Cover src={src} alt={`${place.city}, ${place.country}`} ratio="aspect-[4/5]" sizes="(min-width: 640px) 50vw, 100vw" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          {lead && map}
          {place.businessInsights.length > 0 && (
            <section aria-labelledby="insights">
              <h2 id="insights" className="meta">
                Business observations
              </h2>
              <ul className="mt-2">
                {place.businessInsights.map((insight) => (
                  <li key={insight} className="border-b border-border py-4 text-[15px] leading-relaxed">
                    {insight}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {articles.length > 0 && (
            <section aria-labelledby="place-ideas">
              <h2 id="place-ideas" className="meta">
                Ideas from here
              </h2>
              <ul className="mt-2">
                {articles.map((a) => (
                  <li key={a.slug} lang={a.language} className="border-b border-border py-4">
                    <Link href={a.url} className="link-quiet font-display text-2xl leading-tight tracking-tight decoration-transparent hover:decoration-foreground">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {journal.length > 0 && (
            <section aria-labelledby="place-journal">
              <h2 id="place-journal" className="meta">
                Journal
              </h2>
              <ul className="mt-2">
                {journal.map((j) => (
                  <li key={j.slug} lang={j.language} className="border-b border-border py-4">
                    <Link href={j.url} className="link-quiet font-display text-2xl leading-tight tracking-tight decoration-transparent hover:decoration-foreground">
                      {j.title}
                    </Link>
                    <p className="meta mt-1">{formatDate(j.date)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Connected items={connections} title="Also connected" />
          <TagList tags={tagsOf(place)} />
        </aside>
      </div>

      <div className="shell pb-20">
        <ArrowLink href="/nomading">Back to the map</ArrowLink>
      </div>
      <JsonLd data={placeSchema(place)} />
    </article>
  );
}
