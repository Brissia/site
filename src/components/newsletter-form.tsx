"use client";

import { useId, useState } from "react";
import { site } from "@/data/site";
import { getDictionary, type Lang } from "@/i18n";

/** Remembers, in this browser, that the visitor already subscribed, so the popup never asks again. */
export const SUBSCRIBED_KEY = "newsletter:subscribed";

export function markSubscribed() {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {
    /* storage blocked: nothing to remember */
  }
}

/**
 * Email field + button that sends to the Kit form (site.newsletterAction).
 * The post goes to a hidden iframe, so the visitor never leaves the page.
 * Kit expects the field to be called "email_address".
 */
export function NewsletterForm({
  lang,
  idPrefix,
  onSubscribed,
}: {
  lang: Lang;
  idPrefix: string;
  onSubscribed?: () => void;
}) {
  const t = getDictionary(lang).footer;
  const frame = `kit-${useId().replace(/:/g, "")}`;
  const [sent, setSent] = useState(false);
  const enabled = Boolean(site.newsletterAction);

  if (sent) {
    return (
      <p role="status" className="text-[15px] leading-relaxed">
        {t.thanks}
      </p>
    );
  }

  return (
    <form
      action={site.newsletterAction || undefined}
      method="post"
      target={frame}
      onSubmit={() => {
        markSubscribed();
        // Let the browser send the form first, then swap it for the thank-you line.
        setTimeout(() => {
          setSent(true);
          onSubscribed?.();
        }, 0);
      }}
      className="w-full"
    >
      <fieldset disabled={!enabled} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${idPrefix}-email`} className="sr-only">
          {t.emailLabel}
        </label>
        <input
          id={`${idPrefix}-email`}
          name="email_address"
          type="email"
          required
          autoComplete="email"
          placeholder={t.placeholder}
          className="h-12 w-full shrink-0 rounded-none border border-border bg-transparent px-4 text-[15px] transition-colors duration-200 ease-out placeholder:text-muted hover:border-muted focus:border-foreground focus:outline-none sm:flex-1 sm:shrink"
        />
        <button
          type="submit"
          className="h-12 shrink-0 bg-foreground px-6 text-[14px] font-medium text-background transition-opacity duration-200 ease-out hover:opacity-85 disabled:opacity-40"
        >
          {t.subscribe}
        </button>
      </fieldset>
      {!enabled && <p className="meta mt-3">{t.soon}</p>}
      <iframe name={frame} title={t.emailLabel} hidden tabIndex={-1} />
    </form>
  );
}
