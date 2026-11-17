import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/components/link";
import type { ReactNode } from "react";
import { getDictionary, type Lang } from "@/i18n";
import type { Article } from "@/types/content";
import { formatDate, pad2 } from "@/utils/format";

/** Every section of the site is a chapter. */
export function Chapter({
  number,
  title,
  lead,
  link,
  children,
  id,
  lang = "en",
}: {
  lang?: Lang;
  number: number;
  title: string;
  lead?: string;
  link?: { label: string; href: string };
  children: ReactNode;
  id: string;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border">
      <div className="shell py-16 md:py-24 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:py-28">
        <header className="mb-10 lg:col-span-3 lg:mb-0">
          <p className="meta">
            {getDictionary(lang).common.chapter} {pad2(number)}
          </p>
          <h2 id={id} className="mt-3 font-display text-5xl leading-none tracking-tight md:text-6xl">
            {title}
          </h2>
          {lead && <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted">{lead}</p>}
          {link && (
            <div className="mt-6 hidden lg:block">
              <ArrowLink href={link.href}>{link.label}</ArrowLink>
            </div>
          )}
        </header>
        <div className="lg:col-span-9">{children}</div>
        {link && (
          <div className="mt-10 lg:hidden">
            <ArrowLink href={link.href}>{link.label}</ArrowLink>
          </div>
        )}
      </div>
    </section>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-3 text-[14px] font-medium ${className}`}>
      <span className="link-quiet">{children}</span>
      <ArrowRight
        aria-hidden
        strokeWidth={1.25}
        className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
      />
    </Link>
  );
}

/** Page opening used by every section index: same room layout, different room. */
export function PageIntro({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <header className="shell pb-12 pt-14 md:pb-16 md:pt-24">
      <p className="meta">{label}</p>
      <h1 className="mt-4 font-display text-[3.5rem] leading-[0.95] tracking-tight md:text-8xl">{title}</h1>
      {lead && <p className="mt-6 max-w-xl font-display text-xl italic leading-snug text-muted md:text-2xl">{lead}</p>}
    </header>
  );
}

/** Covers are always black and white. Without an image, a quiet plate holds the space. */
export function Cover({
  src,
  alt,
  label,
  priority,
  ratio = "aspect-[3/2]",
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  src?: string;
  alt: string;
  label?: string;
  priority?: boolean;
  ratio?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-card ${ratio}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div aria-hidden className="absolute inset-0 flex items-end border border-border p-4">
          {label && <span className="meta">{label}</span>}
        </div>
      )}
    </div>
  );
}

export function ArticleMeta({ article, lang = "en" }: { article: Article; lang?: Lang }) {
  const t = getDictionary(lang);
  return (
    <p className="meta flex flex-wrap gap-x-2">
      <span>{t.ideas.categories[article.category] ?? article.category}</span>
      <span aria-hidden>·</span>
      <time dateTime={article.publishedDate}>{formatDate(article.publishedDate, lang)}</time>
      <span aria-hidden>·</span>
      <span>
        {article.readingTime} {t.common.min}
      </span>
    </p>
  );
}

export function ArticleCard({ article, featured = false, lang = "en" }: { article: Article; featured?: boolean; lang?: Lang }) {
  return (
    <article lang={article.language}>
      <Link href={article.url} className="group block">
        {/* Without a cover the piece stands on its typography: a rule instead of an empty plate. */}
        {article.coverImage && (
          <Cover
            src={article.coverImage}
            alt=""
            priority={featured}
            ratio={featured ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[3/2]"}
          />
        )}
        <div className={article.coverImage ? "mt-5" : "border-t border-border pt-5"}>
          <ArticleMeta article={article} lang={lang} />
          <h3
            className={
              featured
                ? "mt-3 font-display text-4xl leading-[1.05] tracking-tight md:text-6xl"
                : "mt-3 font-display text-[1.75rem] leading-[1.1] tracking-tight"
            }
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
              {article.title}
            </span>
          </h3>
          <p className={`mt-3 text-muted ${featured ? "max-w-xl text-lg leading-relaxed" : "text-[15px] leading-relaxed"}`}>
            {article.description}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
