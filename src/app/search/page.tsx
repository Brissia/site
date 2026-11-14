import { Suspense } from "react";
import { SearchClient } from "@/components/search-client";
import { getSearchIndex } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Search",
  description: "Search every idea, place, experiment, book and note on the site.",
  path: "/search",
});

export default function SearchPage() {
  const index = getSearchIndex();
  return (
    <div className="shell pb-20 pt-14 md:pb-28 md:pt-24">
      <h1 className="meta mb-8">Search</h1>
      <Suspense>
        <SearchClient index={index} />
      </Suspense>
    </div>
  );
}
