import { ArrowLink, PageIntro } from "@/components/editorial";
import { Link } from "@/components/link";
import { getDictionary, toLang } from "@/i18n";
import { getTags } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.tags.title, description: t.tags.lead, path: "/tags", lang });
}

export default async function TagsPage({ params }: Props) {
  const t = getDictionary(toLang((await params).lang));
  const tags = getTags();
  return (
    <>
      <PageIntro label={t.tags.index} title={t.tags.title} lead={t.tags.lead} />
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
        <div className="mt-12">
          <ArrowLink href="/graph">{t.graph.link}</ArrowLink>
        </div>
      </div>
    </>
  );
}
