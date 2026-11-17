import { ArrowLink, PageIntro } from "@/components/editorial";
import { Link } from "@/components/link";
import { getDictionary, localize, toLang } from "@/i18n";
import { buildGraph } from "@/lib/graph";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.graph.title, description: t.graph.lead, path: "/graph", lang });
}

export default async function GraphPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const { nodes, edges, size } = buildGraph(lang);
  const hubs = nodes
    .filter((n) => n.kind !== "tag" && n.degree > 0)
    .sort((a, b) => b.degree - a.degree || a.label.localeCompare(b.label))
    .slice(0, 10);

  return (
    <>
      <PageIntro label={t.graph.label} title={t.graph.title} lead={t.graph.lead} />
      <div className="shell pb-20 md:pb-28">
        <div className="border border-border bg-card">
          <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={t.graph.aria} className="mx-auto block h-auto w-full max-w-5xl">
            <g stroke="currentColor" className="text-border">
              {edges.map(({ from, to, strong }) => (
                <line
                  key={`${from.id}-${to.id}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  strokeWidth={strong ? 1.5 : 0.75}
                  className={strong ? "text-muted" : undefined}
                />
              ))}
            </g>
            {nodes.map((n) => {
              const tag = n.kind === "tag";
              const r = tag ? 5 + Math.sqrt(n.degree) * 1.6 : n.kind === "ideas" ? 5 : 3.5;
              return (
                <a key={n.id} href={localize(n.url, lang)} className="group text-foreground">
                  <title>{`${n.label} (${tag ? t.tags.topic : t.kinds[n.kind as keyof typeof t.kinds]})`}</title>
                  {/* A larger invisible target, so small nodes can be tapped on a phone. */}
                  <circle cx={n.x} cy={n.y} r={Math.max(r, 12)} fill="transparent" />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r}
                    fill={tag || n.kind === "ideas" ? "currentColor" : "var(--background)"}
                    stroke="currentColor"
                    strokeWidth={1}
                    className={tag ? undefined : n.kind === "ideas" ? "text-muted group-hover:text-foreground" : "group-hover:fill-foreground"}
                  />
                  {tag && (
                    <text
                      x={n.x}
                      y={n.y - r - 6}
                      textAnchor="middle"
                      fill="currentColor"
                      stroke="var(--card)"
                      strokeWidth={4}
                      paintOrder="stroke"
                      className="font-mono text-[13px] uppercase tracking-[0.08em]"
                    >
                      {n.label}
                    </text>
                  )}
                </a>
              );
            })}
          </svg>
        </div>
        <p className="meta mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <span>● {t.tags.title}</span>
          <span className="opacity-70">● {t.nav.ideas}</span>
          <span>○ {[t.nav.nomading, t.nav.experiments, t.nav.library, t.nav.journal].join(" · ")}</span>
        </p>

        {hubs.length > 0 && (
          <section aria-labelledby="hubs" className="mt-16">
            <h2 id="hubs" className="meta">
              {t.graph.listTitle}
            </h2>
            <ul className="mt-2">
              {hubs.map((n) => (
                <li key={n.id} className="border-b border-border">
                  <Link href={n.url} className="group flex items-baseline justify-between gap-6 py-4">
                    <span className="font-display text-2xl leading-tight tracking-tight">
                      <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{n.label}</span>
                    </span>
                    <span className="meta shrink-0">{t.graph.connections(n.degree)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12">
          <ArrowLink href="/tags">{t.tags.all}</ArrowLink>
        </div>
      </div>
    </>
  );
}
