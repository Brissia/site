import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { getTags } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const lead = "Every subject on the site. Each one gathers ideas, places, experiments, books and notes in a single page.";
export const metadata = pageMetadata({ title: "Topics", description: lead, path: "/tags" });

export default function TagsPage() {
  const tags = getTags();
  return (
    <>
      <PageIntro label="Index" title="Topics" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <ul className="border-t border-border md:columns-2 md:gap-x-6 lg:columns-3">
          {tags.map((tag) => (
            <li key={tag.slug} className="break-inside-avoid border-b border-border">
              <Link href={`/tags/${tag.slug}`} className="group flex items-baseline justify-between gap-6 py-4">
                <span className="font-display text-2xl leading-tight tracking-tight">
                  <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{tag.label}</span>
                </span>
                <span className="meta shrink-0">{String(tag.count).padStart(2, "0")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
