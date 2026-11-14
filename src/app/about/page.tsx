import Image from "next/image";
import { PageIntro } from "@/components/editorial";
import { Mdx } from "@/components/mdx";
import { site } from "@/data/site";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "About", description: site.description, path: "/about" });

export default function AboutPage() {
  const page = getPage("about");
  const portrait = site.aboutPortrait;
  return (
    <>
      <PageIntro label="Chapter 07" title="About" lead={String(page.data.lead ?? "")} />
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
        <Mdx source={page.body} className="lg:col-span-7 lg:col-start-6 [&_h2]:!mt-16 [&_h2]:!text-4xl" />
      </div>
    </>
  );
}
