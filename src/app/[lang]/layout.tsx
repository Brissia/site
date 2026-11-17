import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/editorial";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionProvider } from "@/components/motion";
import { themeScript } from "@/components/theme";
import { site } from "@/data/site";
import { getDictionary, isLang, languages, localize, toLang } from "@/i18n";
import { display, mono, sans } from "@/lib/fonts";
import { languageAlternates, personSchema } from "@/lib/seo";
import "@/styles/globals.css";

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export const generateStaticParams = () => languages.map((lang) => ({ lang }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name}: ${t.titleSuffix}`, template: `%s · ${site.name}` },
    description: t.description,
    alternates: {
      canonical: localize("/", lang),
      languages: languageAlternates("/"),
      types: { "application/rss+xml": [{ url: "/feed.xml", title: `${site.name}: Ideas` }] },
    },
    openGraph: { type: "website", siteName: site.name, url: localize("/", lang), title: site.name, description: t.description },
    twitter: { card: "summary", title: site.name, description: t.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default async function LanguageLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} id="top" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer lang={lang} />
        </MotionProvider>
        <JsonLd data={personSchema(lang)} />
        <Analytics />
      </body>
    </html>
  );
}
