import { PageIntro } from "@/components/editorial";
import { getDictionary, toLang } from "@/i18n";
import { getTalks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.speaking, description: t.speaking.lead, path: "/speaking", lang });
}

export default async function SpeakingPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const talks = getTalks();
  return (
    <>
      <PageIntro label={`${t.common.chapter} 06`} title={t.nav.speaking} lead={t.speaking.lead} />
      <div className="shell pb-20 md:pb-28">
        {talks.length === 0 ? (
          <p className="max-w-md font-display text-2xl italic leading-snug text-muted">{t.speaking.empty}</p>
        ) : (
          <ol>
            {talks.map((talk) => (
              <li key={talk.slug} lang={talk.language} className="border-t border-border py-8 md:grid md:grid-cols-12 md:gap-x-6 md:py-10">
                <p className="meta md:col-span-3 md:pt-2">
                  <time dateTime={talk.date}>{formatDate(talk.date, lang)}</time>
                  <br />
                  {t.speaking.types[talk.type] ?? talk.type}
                </p>
                <div className="mt-3 md:col-span-9 md:mt-0">
                  <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">{talk.title}</h2>
                  <p className="mt-2 text-[15px] text-muted">
                    {talk.event}
                    {talk.location && <> · {talk.location}</>}
                  </p>
                  {(talk.video || talk.slides) && (
                    <ul className="mt-4 flex flex-wrap gap-x-6 text-[14px]">
                      {talk.video && (
                        <li>
                          <a href={talk.video} target="_blank" rel="noopener noreferrer" className="link-quiet">
                            {t.speaking.watch}
                          </a>
                        </li>
                      )}
                      {talk.slides && (
                        <li>
                          <a href={talk.slides} target="_blank" rel="noopener noreferrer" className="link-quiet">
                            {t.speaking.slides}
                          </a>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
