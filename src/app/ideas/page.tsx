import { ArticleCard, PageIntro } from "@/components/editorial";
import { Reveal } from "@/components/motion";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

const lead = "Long-form thinking on growth, cities, technology and the people in between.";
export const metadata = pageMetadata({ title: "Ideas", description: lead, path: "/ideas" });

export default function IdeasPage() {
  const [featured, ...rest] = getArticles();
  return (
    <>
      <PageIntro label="Chapter 02" title="Ideas" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        {featured ? (
          <>
            <ArticleCard article={featured} featured />
            <ul className="mt-16 grid gap-x-6 gap-y-14 md:mt-24 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <li key={a.slug}>
                  <Reveal delay={(i % 3) * 0.06}>
                    <ArticleCard article={a} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="font-display text-2xl italic text-muted">The first essay is being written.</p>
        )}
      </div>
    </>
  );
}
