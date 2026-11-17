import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { getExperiments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { pad2 } from "@/utils/format";

const lead = "A laboratory for unfinished ideas. Some of these will work.";
export const metadata = pageMetadata({ title: "Experiments", description: lead, path: "/experiments" });

export default function ExperimentsPage() {
  const experiments = getExperiments();
  return (
    <>
      <PageIntro label="Chapter 03" title="Experiments" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <ol>
          {experiments.map((e, i) => (
            <li key={e.slug} id={e.slug} className="scroll-mt-24 border-t border-border py-8 md:grid md:grid-cols-12 md:gap-x-6 md:py-10">
              <p className="meta md:col-span-1 md:pt-2">{pad2(i + 1)}</p>
              <div className="mt-3 md:col-span-7 md:mt-0">
                <h2 className="font-display text-3xl leading-tight tracking-tight md:text-4xl">
                  <Link href={e.url} className="link-quiet decoration-transparent hover:decoration-foreground">
                    {e.title}
                  </Link>
                </h2>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{e.description}</p>
                {e.links.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-6 text-[14px]">
                    {e.links.map((l) => (
                      <li key={l.url}>
                        <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <dl className="meta mt-5 grid grid-cols-[5rem_1fr] gap-y-2 md:col-span-4 md:mt-0 md:pt-2">
                <dt>Status</dt>
                <dd className="text-foreground">{e.status}</dd>
                <dt>Field</dt>
                <dd className="text-foreground">{e.category}</dd>
                {e.tools.length > 0 && (
                  <>
                    <dt>Tools</dt>
                    <dd className="text-foreground">{e.tools.join(", ")}</dd>
                  </>
                )}
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
