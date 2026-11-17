import { Link } from "@/components/link";
import { PageIntro } from "@/components/editorial";
import { getDictionary, toLang } from "@/i18n";
import { getExperiments } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { pad2 } from "@/utils/format";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.experiments, description: t.experiments.lead, path: "/experiments", lang });
}

export default async function ExperimentsPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const experiments = getExperiments();
  return (
    <>
      <PageIntro label={`${t.common.chapter} 03`} title={t.nav.experiments} lead={t.experiments.lead} />
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
                <dt>{t.experiments.status}</dt>
                <dd className="text-foreground">{t.experiments.statuses[e.status] ?? e.status}</dd>
                <dt>{t.experiments.field}</dt>
                <dd className="text-foreground">{e.category}</dd>
                {e.tools.length > 0 && (
                  <>
                    <dt>{t.experiments.tools}</dt>
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
