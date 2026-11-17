import Image from "next/image";
import { ArrowLink, PageIntro } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { site } from "@/data/site";
import { getDictionary, toLang } from "@/i18n";
import { getPage, getTalks } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return pageMetadata({ title: t.nav.about, description: t.description, path: "/about", lang });
}

export default async function AboutPage({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  const page = getPage("about", lang);
  const portrait = site.aboutPortrait;
  return (
    <div lang={page.language}>
      <PageIntro label={`${t.common.chapter} 07`} title={t.nav.about} lead={page.data.lead ? String(page.data.lead) : undefined} />
      <div className="shell pb-20 md:pb-28 lg:grid lg:grid-cols-12 lg:gap-x-6">
        {portrait.src && (
          <figure className="mb-12 lg:col-span-4 lg:mb-0">
            <div className="bg-card px-6 pt-8 lg:sticky lg:top-24">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                priority
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="mx-auto h-auto w-full max-w-sm grayscale"
              />
            </div>
          </figure>
        )}
        <div className="lg:col-span-7 lg:col-start-6">
          <Mdx source={page.body} className="[&_h2]:!mt-16 [&_h2]:!text-4xl" />
          {getTalks().length > 0 && (
            <div className="mt-12">
              <ArrowLink href="/speaking">{t.nav.speaking}</ArrowLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
