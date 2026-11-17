import { Suspense } from "react";
import { SearchClient } from "@/components/search-client";
import { getDictionary, toLang } from "@/i18n";
import { getSearchIndex } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.common.search, description: t.search.description, path: "/search", lang });
}

export default async function SearchPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const index = getSearchIndex(lang);
  return (
    <div className="shell pb-20 pt-14 md:pb-28 md:pt-24">
      <h1 className="meta mb-8">{getDictionary(lang).common.search}</h1>
      <Suspense>
        <SearchClient index={index} />
      </Suspense>
    </div>
  );
}
