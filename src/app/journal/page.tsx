import Link from "next/link";
import { TagList } from "@/components/connected";
import { PageIntro } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { getJournalEntries, resolveLocation, tagsOf } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

const lead = "Short thoughts, observations and notes from the road. Never more than three hundred words.";
export const metadata = pageMetadata({ title: "Journal", description: lead, path: "/journal" });

export default function JournalPage() {
  const entries = getJournalEntries();
  return (
    <>
      <PageIntro label="Chapter 05" title="Journal" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <ol className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          {entries.map((entry) => {
            const place = resolveLocation(entry.location);
            return (
              <li
                key={entry.slug}
                id={entry.slug}
                lang={entry.language}
                className="scroll-mt-24 border-t border-border py-10 md:grid md:grid-cols-8 md:gap-x-6 md:py-14 lg:col-span-10 lg:col-start-2"
              >
                <p className="meta md:col-span-2 md:pt-2">
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  {place && (
                    <>
                      <br />
                      {place.url ? (
                        <Link href={place.url} className="link-quiet">
                          {place.label}
                        </Link>
                      ) : (
                        place.label
                      )}
                    </>
                  )}
                </p>
                <div className="mt-4 md:col-span-6 md:mt-0">
                  <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">{entry.title}</h2>
                  <Mdx source={entry.body} className="mt-4" />
                  <TagList tags={tagsOf(entry)} className="mt-6" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
