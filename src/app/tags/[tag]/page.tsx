import { notFound } from "next/navigation";
import { ContentList } from "@/components/connected";
import { ArrowLink, PageIntro } from "@/components/editorial";
import { getContentForTag, getTags } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getTags().map((t) => ({ tag: t.slug }));

const SECTIONS = { ideas: "Ideas", atlas: "Atlas", experiments: "Experiments", library: "Library", journal: "Journal", talks: "Speaking" };

function describe(found: NonNullable<ReturnType<typeof getContentForTag>>): string {
  const sections = [...new Set(found.items.map((i) => SECTIONS[i.collection]))];
  const where = sections.length > 1 ? `${sections.slice(0, -1).join(", ")} and ${sections.at(-1)}` : sections[0];
  return `${found.items.length} ${found.items.length === 1 ? "entry" : "entries"} in ${where}.`;
}

export async function generateMetadata({ params }: Props) {
  const found = getContentForTag((await params).tag);
  if (!found) return {};
  return pageMetadata({
    title: `Topic: ${found.tag.label}`,
    description: `Everything on ${found.tag.label}. ${describe(found)}`,
    path: `/tags/${found.tag.slug}`,
  });
}

export default async function TagPage({ params }: Props) {
  const found = getContentForTag((await params).tag);
  if (!found) notFound();
  return (
    <>
      <PageIntro label="Topic" title={found.tag.label} lead={describe(found)} />
      <div className="shell pb-20 md:pb-28">
        <ContentList items={found.items} />
        <div className="mt-12 border-t border-border pt-10">
          <ArrowLink href="/tags">All topics</ArrowLink>
        </div>
      </div>
    </>
  );
}
