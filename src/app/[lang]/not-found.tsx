"use client";

import { ArrowLink } from "@/components/editorial";
import { useLang } from "@/components/link";
import { getDictionary } from "@/i18n";

export default function NotFound() {
  const t = getDictionary(useLang()).notFound;
  return (
    <div className="shell py-28 md:py-40">
      <p className="meta">404</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl leading-none tracking-tight md:text-7xl">{t.title}</h1>
      <ArrowLink href="/" className="mt-10">
        {t.back}
      </ArrowLink>
    </div>
  );
}
