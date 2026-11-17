import { Link } from "@/components/link";
import { notFound } from "next/navigation";
import { ArticleMeta, Cover, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { ScrollProgress } from "@/components/motion";
import { Connected, TagList } from "@/components/connected";
import { getDictionary, toLang } from "@/i18n";
import { getArticle, getArticles, getConnections, getRecommendations, resolveLocation, tagsOf } from "@/lib/content";
import { articleSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getArticles().map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    lang: toLang(lang),
    title: article.title,
    description: article.description,
    path: article.url,
    image: article.coverImage,
    type: "article",
    publishedTime: article.publishedDate,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = toLang(rawLang);
  const t = getDictionary(lang);
  const article = getArticle(slug);
  if (!article) notFound();

  const place = resolveLocation(article.location);
  // The place is already named under the title, so it is not repeated at the end.
  const related = getConnections(article).filter((c) => !(c.collection === "atlas" && c.slug === article.location));

  return (
    <article lang={article.language}>
      <ScrollProgress />
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <ArticleMeta article={article} lang={lang} />
          <h1 className="mt-5 font-display text-[2.75rem] leading-[1.02] tracking-tight md:text-7xl">{article.title}</h1>
          <p className="mt-6 max-w-2xl font-display text-xl italic leading-snug text-muted md:text-2xl">{article.description}</p>
          {place && (
            <p className="meta mt-8">
              {t.ideas.writtenFrom}{" "}
              {place.url ? (
                <Link href={place.url} className="link-quiet text-foreground">
                  {place.label}
                </Link>
              ) : (
                place.label
              )}
            </p>
          )}
        </div>
      </header>

      {article.coverImage && (
        <div className="shell">
          <Cover src={article.coverImage} alt="" priority ratio="aspect-[4/3] md:aspect-[21/9]" sizes="100vw" />
        </div>
      )}

      <div className="shell py-12 md:py-20">
        <Mdx source={article.body} className="mx-auto" />

        <footer className="mx-auto mt-16 max-w-[38rem] space-y-12">
          <TagList tags={tagsOf(article)} lang={lang} />

          {article.references.length > 0 && (
            <section aria-labelledby="references">
              <h2 id="references" className="meta">
                {t.ideas.references}
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] text-muted">
                {article.references.map((ref) => (
                  <li key={ref.title}>
                    {ref.url ? (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                        {ref.title}
                      </a>
                    ) : (
                      ref.title
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {article.originalUrl && (
            <p className="meta">
              {t.ideas.firstPublished}{" "}
              <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-foreground">
                {new URL(article.originalUrl).hostname.replace(/^www\./, "")}
              </a>
            </p>
          )}

          <Connected items={related} lang={lang} />
          <Connected items={getRecommendations(article, related)} title={t.common.readNext} id="read-next" lang={lang} />
        </footer>
      </div>
      <JsonLd data={articleSchema(article)} />
    </article>
  );
}
