import { ArticleCard, PageIntro } from "@/components/editorial";
import { Reveal } from "@/components/motion";
import { getDictionary, toLang } from "@/i18n";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.ideas, description: t.ideas.lead, path: "/ideas", lang });
}

export default async function IdeasPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const [featured, ...rest] = getArticles();
  return (
    <>
      <PageIntro label={`${t.common.chapter} 02`} title={t.nav.ideas} lead={t.ideas.lead} />
      <div className="shell pb-20 md:pb-28">
        {featured ? (
          <>
            <ArticleCard article={featured} featured lang={lang} />
            <ul className="mt-16 grid gap-x-6 gap-y-14 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <li key={a.slug}>
                  <Reveal delay={(i % 3) * 0.06}>
                    <ArticleCard article={a} lang={lang} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="font-display text-2xl italic text-muted">{t.ideas.empty}</p>
        )}
      </div>
    </>
  );
}
