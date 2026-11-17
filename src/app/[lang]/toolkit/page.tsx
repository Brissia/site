import { PageIntro } from "@/components/editorial";
import { Link } from "@/components/link";
import { getDictionary, toLang } from "@/i18n";
import { getToolkitItems } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.toolkit, description: t.toolkit.lead, path: "/toolkit", lang });
}

export default async function ToolkitPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const items = getToolkitItems();
  const groups = [
    { id: "companies", title: t.toolkit.forCompanies, items: items.filter((i) => i.audience === "companies") },
    { id: "people", title: t.toolkit.forPeople, items: items.filter((i) => i.audience === "people") },
  ].filter((g) => g.items.length > 0);

  return (
    <>
      <PageIntro label={t.expertise.title} title={t.nav.toolkit} lead={t.toolkit.lead} />
      <div className="shell space-y-16 pb-20 md:pb-28">
        {groups.map((group) => (
          <section key={group.id} aria-labelledby={`toolkit-${group.id}`}>
            <h2 id={`toolkit-${group.id}`} className="meta">
              {group.title}
            </h2>
            <ul className="mt-4">
              {group.items.map((item) => (
                <li key={item.slug} lang={item.language} className="border-t border-border">
                  <Link href={item.url} className="group grid gap-1 py-6 md:grid-cols-12 md:gap-6">
                    <p className="meta md:col-span-2 md:pt-2">
                      {t.toolkit.formats[item.format] ?? item.format}
                      {(item.downloadLabel || item.linkLabel) && <> · {item.downloadLabel ?? item.linkLabel}</>}
                    </p>
                    <div className="md:col-span-10">
                      <h3 className="font-display text-3xl leading-tight tracking-tight">
                        <span className="link-quiet decoration-transparent group-hover:decoration-foreground">{item.title}</span>
                      </h3>
                      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
