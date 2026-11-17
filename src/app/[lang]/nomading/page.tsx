import { AtlasExplorer } from "@/components/atlas-explorer";
import { PageIntro } from "@/components/editorial";
import { getDictionary, toLang } from "@/i18n";
import { getAtlasEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.nomading, description: t.nomading.lead, path: "/nomading", lang });
}

export default async function NomadingPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const places = getAtlasEntries(lang).map(({ slug, city, country, coordinates, notes, url, themes, photos, visitedDate }) => ({
    slug,
    city,
    country,
    coordinates,
    notes,
    url,
    themes,
    photo: photos[0],
    dateLabel: visitedDate ? formatDate(visitedDate, lang) : undefined,
  }));
  const themes = [...new Set(places.flatMap((p) => p.themes))].sort();

  return (
    <>
      <PageIntro label={`${t.common.chapter} 01`} title={t.nav.nomading} lead={t.nomading.lead} />
      <div className="shell pb-20 md:pb-28">
        <AtlasExplorer places={places} themes={themes} />
      </div>
    </>
  );
}
