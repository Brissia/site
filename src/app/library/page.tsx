import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { getArticles, getLibraryItems } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const lead = "A public second brain. Every entry carries a note on why it mattered.";
export const metadata = pageMetadata({ title: "Library", description: lead, path: "/library" });

export default function LibraryPage() {
  const items = getLibraryItems();
  const articles = getArticles();
  return (
    <>
      <PageIntro label="Chapter 04" title="Library" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <ul>
          {items.map((item) => {
            const ideas = articles.filter((a) => item.relatedIdeas.includes(a.slug));
            return (
              <li key={item.slug} id={item.slug} className="scroll-mt-24 border-t border-border py-8 md:grid md:grid-cols-12 md:gap-x-6 md:py-10">
                <p className="meta md:col-span-2 md:pt-2">
                  {item.type}
                  {item.year && <> · {item.year}</>}
                </p>
                <div className="mt-3 md:col-span-5 md:mt-0">
                  <h2 className="font-display text-3xl leading-tight tracking-tight">
                    <Link href={item.url} className="link-quiet decoration-transparent hover:decoration-foreground">
                      {item.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-[15px] text-muted">{item.author}</p>
                </div>
                <div className="mt-4 md:col-span-5 md:mt-0">
                  <p className="font-display text-xl italic leading-snug">{item.personalReview}</p>
                  {ideas.length > 0 && (
                    <p className="meta mt-4">
                      Appears in{" "}
                      {ideas.map((a, i) => (
                        <span key={a.slug}>
                          {i > 0 && ", "}
                          <Link href={a.url} className="link-quiet text-foreground">
                            {a.title}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
