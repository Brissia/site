import { ArrowLink, PageIntro } from "@/components/editorial";
import { getDictionary, toLang } from "@/i18n";
import { getTimeline } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.timeline, description: t.timeline.lead, path: "/about/timeline", lang });
}

export default async function TimelinePage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const entries = getTimeline();
  return (
    <>
      <PageIntro label={t.nav.about} title={t.nav.timeline} lead={t.timeline.lead} />
      <div className="shell pb-20 md:pb-28">
        {/* Every entry carries the same weight: the newest role is one line among the others. */}
        <ol>
          {entries.map((entry) => {
            const start = formatDate(entry.start, lang);
            const end = entry.end ? formatDate(entry.end, lang) : t.timeline.present;
            return (
              <li key={`${entry.start}-${entry.organization}-${entry.title}`} className="border-t border-border py-6 md:grid md:grid-cols-12 md:gap-x-6 md:py-8">
                <p className="meta md:col-span-3 md:pt-2">
                  {start === end ? start : `${start} – ${end}`}
                  <br />
                  {t.timeline.types[entry.type]}
                </p>
                <div className="mt-3 md:col-span-9 md:mt-0">
                  <h2 className="font-display text-2xl leading-tight tracking-tight md:text-3xl">{entry.title}</h2>
                  <p className="mt-1 text-[15px] text-muted">
                    {entry.organization}
                    {entry.place && <> · {entry.place}</>}
                  </p>
                  {entry.note && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted">{entry.note}</p>}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-12 border-t border-border pt-10">
          <ArrowLink href="/about">{t.nav.about}</ArrowLink>
        </div>
      </div>
    </>
  );
}
