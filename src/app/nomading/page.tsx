import { AtlasExplorer } from "@/components/atlas-explorer";
import { PageIntro } from "@/components/editorial";
import { getAtlasEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/utils/format";

const lead = "Life as a digital nomad, one place at a time. A photograph, a sentence and a date from every stop.";
export const metadata = pageMetadata({ title: "Nomading", description: lead, path: "/nomading" });

export default function NomadingPage() {
  const places = getAtlasEntries().map(({ slug, city, country, coordinates, notes, url, themes, photos, visitedDate }) => ({
    slug,
    city,
    country,
    coordinates,
    notes,
    url,
    themes,
    photo: photos[0],
    dateLabel: visitedDate ? formatDate(visitedDate) : undefined,
  }));
  const themes = [...new Set(places.flatMap((p) => p.themes))].sort();

  return (
    <>
      <PageIntro label="Chapter 01" title="Nomading" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <AtlasExplorer places={places} themes={themes} />
      </div>
    </>
  );
}
