import { ArrowLink, PageIntro } from "@/components/editorial";
import { TimelineTrack } from "@/components/timeline";
import { getDictionary, toLang } from "@/i18n";
import { getTimeline } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { TimelineEntry } from "@/types/content";
import { formatDate } from "@/utils/format";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.timeline, description: t.timeline.lead, path: "/about/timeline", lang });
}

/** Sections of the page, in order. Education and recognition share the last one. */
const SECTIONS: { id: string; types: TimelineEntry["type"][] }[] = [
  { id: "work", types: ["work"] },
  { id: "volunteering", types: ["volunteering"] },
  { id: "education", types: ["education", "recognition"] },
];

export default async function TimelinePage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const entries = getTimeline();

  return (
    <>
      <PageIntro label={t.nav.about} title={t.nav.timeline} lead={t.timeline.lead} />
      <div className="shell pb-20 md:pb-28">
        {SECTIONS.map((section) => {
          const items = entries
            .filter((entry) => section.types.includes(entry.type))
            .map((entry) => {
              const start = formatDate(entry.start, lang);
              const end = entry.end ? formatDate(entry.end, lang) : t.timeline.present;
              return {
                key: `${entry.start}-${entry.organization}`,
                dates: start === end ? start : `${start} – ${end}`,
                title: entry.title,
                organization: entry.organization,
                place: entry.place,
                note: entry.note,
              };
            });
          if (items.length === 0) return null;
          return (
            <section
              key={section.id}
              aria-labelledby={`timeline-${section.id}`}
              className="border-t border-border py-12 md:py-20 lg:grid lg:grid-cols-12 lg:gap-x-6"
            >
              <header className="mb-10 lg:col-span-4 lg:mb-0">
                <h2 id={`timeline-${section.id}`} className="font-display text-4xl leading-none tracking-tight md:text-5xl lg:sticky lg:top-28">
                  {t.timeline.sections[section.id as keyof typeof t.timeline.sections]}
                </h2>
              </header>
              <div className="lg:col-span-8">
                <TimelineTrack items={items} />
              </div>
            </section>
          );
        })}
        <div className="border-t border-border pt-10">
          <ArrowLink href="/about">{t.nav.about}</ArrowLink>
        </div>
      </div>
    </>
  );
}
