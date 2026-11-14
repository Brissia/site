import { site } from "@/data/site";
import { getArticles } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getArticles()
    .map(
      (a) => `
    <item>
      <title>${escape(a.title)}</title>
      <link>${absoluteUrl(a.url)}</link>
      <guid isPermaLink="true">${absoluteUrl(a.url)}</guid>
      <description>${escape(a.description)}</description>
      <pubDate>${new Date(`${a.publishedDate}T12:00:00Z`).toUTCString()}</pubDate>
      ${a.tags.map((t) => `<category>${escape(t)}</category>`).join("")}
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}: Ideas</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>${site.locale}</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
