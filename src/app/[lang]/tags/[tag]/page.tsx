import { notFound } from "next/navigation";
import { ContentList } from "@/components/connected";
import { ArrowLink, PageIntro } from "@/components/editorial";
import { getDictionary, toLang, type Lang } from "@/i18n";
import { getContentForTag, getTags, sectionNames } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; tag: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getTags().map((t) => ({ tag: t.slug }));

function describe(found: NonNullable<ReturnType<typeof getContentForTag>>, lang: Lang): string {
  const names = sectionNames(lang);
  const sections = [...new Set(found.items.map((i) => names[i.collection]))];
  return getDictionary(lang).tags.describe(found.items.length, sections);
}

export async function generateMetadata({ params }: Props) {
  const { lang: rawLang, tag } = await params;
  const lang = toLang(rawLang);
  const t = getDictionary(lang).tags;
  const found = getContentForTag(tag, lang);
  if (!found) return {};
  return pageMetadata({
    title: t.metaTitle(found.tag.label),
    description: `${t.everything(found.tag.label)} ${describe(found, lang)}`,
    path: `/tags/${found.tag.slug}`,
    lang,
  });
}

export default async function TagPage({ params }: Props) {
  const { lang: rawLang, tag } = await params;
  const lang = toLang(rawLang);
  const t = getDictionary(lang).tags;
  const found = getContentForTag(tag, lang);
  if (!found) notFound();
  return (
    <>
      <PageIntro label={t.topic} title={found.tag.label} lead={describe(found, lang)} />
      <div className="shell pb-20 md:pb-28">
        <ContentList items={found.items} lang={lang} />
        <div className="mt-12 border-t border-border pt-10">
          <ArrowLink href="/tags">{t.all}</ArrowLink>
        </div>
      </div>
    </>
  );
}
