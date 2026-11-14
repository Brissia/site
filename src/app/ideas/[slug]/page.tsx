import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleMeta, Cover, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { ScrollProgress } from "@/components/motion";
import { contentTitle, getArticle, getArticles, resolveLocation, resolveRefs } from "@/lib/content";
import { articleSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getArticles().map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.description,
    path: article.url,
    image: article.coverImage,
    type: "article",
    publishedTime: article.publishedDate,
  });
}

const SECTION_LABEL: Record<string, string> = {
  ideas: "Idea",
  atlas: "Place",
  experiments: "Experiment",
  library: "Library",
  journal: "Journal",
};

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const place = resolveLocation(article.location);
  const related = resolveRefs(article.relatedContent);

  return (
    <article lang={article.language}>
      <ScrollProgress />
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <ArticleMeta article={article} />
          <h1 className="mt-5 font-display text-[2.75rem] leading-[1.02] tracking-tight md:text-7xl">{article.title}</h1>
          <p className="mt-6 max-w-2xl font-display text-xl italic leading-snug text-muted md:text-2xl">{article.description}</p>
          {place && (
            <p className="meta mt-8">
              Written from{" "}
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
          {article.tags.length > 0 && (
            <ul aria-label="Topics" className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="meta block border border-border px-3 py-2 transition-colors duration-200 ease-out hover:border-foreground hover:text-foreground"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {article.references.length > 0 && (
            <section aria-labelledby="references">
              <h2 id="references" className="meta">
                References
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
              First published on{" "}
              <a href={article.originalUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-foreground">
                {new URL(article.originalUrl).hostname.replace(/^www\./, "")}
              </a>
            </p>
          )}

          {related.length > 0 && (
            <section aria-labelledby="connected">
              <h2 id="connected" className="meta">
                Connected to
              </h2>
              <ul className="mt-2">
                {related.map((item) => (
                  <li key={item.url} className="border-b border-border">
                    <Link href={item.url} className="group flex items-baseline justify-between gap-6 py-4">
                      <span className="font-display text-2xl leading-tight tracking-tight">
                        <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{contentTitle(item)}</span>
                      </span>
                      <span className="meta shrink-0">{SECTION_LABEL[item.collection]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </footer>
      </div>
      <JsonLd data={articleSchema(article)} />
    </article>
  );
}
