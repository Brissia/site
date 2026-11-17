"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { localize, toLang, type Lang } from "@/i18n";

/** The interface language of the page being viewed. */
export function useLang(): Lang {
  return toLang(useParams()?.lang);
}

/**
 * The site's link. Write hrefs as if the site had one language ("/ideas");
 * the language prefix is added for whoever is reading in Spanish.
 */
export function Link({ href, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const lang = useLang();
  return <NextLink href={localize(href, lang)} {...props} />;
}
