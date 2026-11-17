import { notFound } from "next/navigation";
import { Connected, TagList } from "@/components/connected";
import { ArrowLink, Cover, JsonLd } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { getConnections, getExperiment, getExperiments, tagsOf } from "@/lib/content";
import { creativeWorkSchema, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => getExperiments().map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }: Props) {
  const experiment = getExperiment((await params).slug);
  if (!experiment) return {};
  return pageMetadata({
    title: experiment.title,
    description: experiment.description,
    path: experiment.url,
    image: experiment.screenshots[0],
  });
}

export default async function ExperimentPage({ params }: Props) {
  const experiment = getExperiment((await params).slug);
  if (!experiment) notFound();
  const connections = getConnections(experiment);

  return (
    <article>
      <header className="shell pb-10 pt-14 md:pb-14 md:pt-24">
        <p className="meta">Experiment · {experiment.status}</p>
        <h1 className="mt-4 max-w-5xl font-display text-[3rem] leading-[0.98] tracking-tight md:text-7xl">{experiment.title}</h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic leading-snug text-muted md:text-2xl">{experiment.description}</p>
      </header>

      <div className="shell grid gap-14 border-t border-border py-12 md:py-20 lg:grid-cols-12 lg:gap-x-6">
        <div className="space-y-12 lg:col-span-7">
          {experiment.screenshots.map((src) => (
            <Cover key={src} src={src} alt="" />
          ))}
          {experiment.body ? (
            <Mdx source={experiment.body} />
          ) : (
            <p className="max-w-md font-display text-2xl italic leading-snug text-muted">Notes on this one are still being written.</p>
          )}
          {experiment.technicalNotes && (
            <section aria-labelledby="technical-notes">
              <h2 id="technical-notes" className="meta">
                Technical notes
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">{experiment.technicalNotes}</p>
            </section>
          )}
        </div>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          <dl className="meta grid grid-cols-[5rem_1fr] gap-y-3">
            <dt>Status</dt>
            <dd className="text-foreground">{experiment.status}</dd>
            <dt>Field</dt>
            <dd className="text-foreground">{experiment.category}</dd>
            {experiment.tools.length > 0 && (
              <>
                <dt>Tools</dt>
                <dd className="text-foreground">{experiment.tools.join(", ")}</dd>
              </>
            )}
          </dl>

          {experiment.links.length > 0 && (
            <ul className="space-y-3 text-[15px]">
              {experiment.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <TagList tags={tagsOf(experiment)} />
          <Connected items={connections} />
        </aside>
      </div>

      <div className="shell pb-20">
        <ArrowLink href="/experiments">All experiments</ArrowLink>
      </div>
      <JsonLd data={creativeWorkSchema({ name: experiment.title, description: experiment.description, path: experiment.url })} />
    </article>
  );
}
