import { ArrowDown, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Connected, TagList } from "@/components/connected";
import { ArrowLink, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { getDictionary, toLang } from "@/i18n";
import { getConnections, getToolkitItem, getToolkitItems, tagsOf } from "@/lib/content";
import { creativeWorkSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getToolkitItems().map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  const item = getToolkitItem(slug);
  if (!item) return {};
  return pageMetadata({ lang: toLang(lang), title: item.title, description: item.description, path: item.url });
}

const action =
  "inline-flex h-12 items-center gap-3 bg-foreground px-6 text-[14px] font-medium text-background transition-opacity duration-200 ease-out hover:opacity-85 print:hidden";

export default async function ToolkitItemPage({ params }: Props) {
  const { lang: rawLang, slug } = await params;
  const lang = toLang(rawLang);
  const t = getDictionary(lang);
  const item = getToolkitItem(slug);
  if (!item) notFound();

  return (
    <article lang={item.language}>
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <p className="meta" lang={lang}>
          {t.nav.toolkit} · {t.toolkit.formats[item.format] ?? item.format}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-[3rem] leading-[0.98] tracking-tight md:text-7xl">{item.title}</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic leading-snug text-muted md:text-2xl">{item.description}</p>
        <div className="mt-8 flex flex-wrap gap-3" lang={lang}>
          {item.download && (
            <a href={item.download} download className={action}>
              <ArrowDown aria-hidden strokeWidth={1.25} className="size-4" />
              {t.toolkit.download}
              {item.downloadLabel && <span className="opacity-70">{item.downloadLabel}</span>}
            </a>
          )}
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={action}>
              <ArrowUpRight aria-hidden strokeWidth={1.25} className="size-4" />
              {t.toolkit.open}
              {item.linkLabel && <span className="opacity-70">{item.linkLabel}</span>}
            </a>
          )}
        </div>
      </header>

      <div className="shell grid gap-14 border-t border-border py-12 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="lg:col-span-8">{item.body && <Mdx source={item.body} className="!max-w-none [&>h2:first-child]:!mt-0 [&_h3]:!text-2xl" />}</div>
        <aside className="space-y-12 lg:col-span-3 lg:col-start-10 print:hidden" lang={lang}>
          <TagList tags={tagsOf(item)} lang={lang} />
          <Connected items={getConnections(item)} lang={lang} />
        </aside>
      </div>

      <div className="shell pb-20 print:hidden" lang={lang}>
        <ArrowLink href="/toolkit">{t.toolkit.all}</ArrowLink>
      </div>
      <JsonLd data={creativeWorkSchema({ name: item.title, description: item.description, path: item.url })} />
    </article>
  );
}
