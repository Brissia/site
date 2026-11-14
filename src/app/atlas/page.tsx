import { AtlasExplorer } from "@/components/atlas-explorer";
import { PageIntro } from "@/components/editorial";
import { getAtlasEntries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatCoordinates } from "@/utils/format";

const lead = "Not a travel page. A geographic record of what each city taught about business, culture and people.";
export const metadata = pageMetadata({ title: "Atlas", description: lead, path: "/atlas" });

export default function AtlasPage() {
  const places = getAtlasEntries().map(({ slug, city, country, coordinates, notes, url, themes }) => ({
    slug,
    city,
    country,
    coordinates,
    notes,
    url,
    themes,
    coordinatesLabel: formatCoordinates(coordinates),
  }));
  const themes = [...new Set(places.flatMap((p) => p.themes))].sort();

  return (
    <>
      <PageIntro label="Chapter 02" title="Atlas" lead={lead} />
      <div className="shell pb-20 md:pb-28">
        <AtlasExplorer places={places} themes={themes} />
      </div>
    </>
  );
}
