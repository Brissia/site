import { notFound } from "next/navigation";
import { Connected, TagList } from "@/components/connected";
import { ArrowLink, Cover, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { getDictionary, toLang } from "@/i18n";
import { getConnections, getLibraryItem, getLibraryItems, tagsOf } from "@/lib/content";
import { libraryItemSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getLibraryItems().map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) return {};
  return pageMetadata({
    lang: toLang(lang),
    title: `${item.title}, ${item.author}`,
    description: item.personalReview,
    path: item.url,
    image: item.cover,
  });
}

export default async function LibraryItemPage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = toLang(rawLang);
  const t = getDictionary(lang);
  const item = getLibraryItem(slug);
  if (!item) notFound();
  const connections = getConnections(item);

  return (
    <article>
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <p className="meta">
          {t.nav.library} · {t.library.types[item.type] ?? item.type}
          {item.year && <> · {item.year}</>}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-[3rem] leading-[0.98] tracking-tight md:text-7xl">{item.title}</h1>
        <p className="mt-4 text-lg text-muted md:text-xl">{item.author}</p>
      </header>

      <div className="shell grid gap-14 border-t border-border py-12 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-7">
          {/* The annotation is the entry. Everything else is context for it. */}
          <blockquote className="font-display text-[1.75rem] italic leading-[1.25] tracking-tight md:text-4xl">
            {item.personalReview}
          </blockquote>
          {item.body && <Mdx source={item.body} className="mt-12" />}
          {item.link && (
            <p className="mt-12 text-[15px]">
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-quiet">
                {t.library.source}
              </a>
            </p>
          )}
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          {item.cover && <Cover src={item.cover} alt="" ratio="aspect-[2/3]" sizes="(min-width: 1024px) 30vw, 60vw" />}
          <TagList tags={tagsOf(item)} lang={lang} />
          <Connected items={connections} lang={lang} />
        </aside>
      </div>

      <div className="shell pb-20">
        <ArrowLink href="/library">{t.library.all}</ArrowLink>
      </div>
      <JsonLd data={libraryItemSchema(item)} />
    </article>
  );
}
