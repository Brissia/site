import { ExpertisePage } from "@/components/expertise";
import { getDictionary, toLang } from "@/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.people, description: t.expertise.peopleLead, path: "/people", lang });
}

export default async function Page({ params }: Props) {
  return <ExpertisePage name="people" lang={toLang((await params).lang)} />;
}
