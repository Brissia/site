"use client";

import { X } from "lucide-react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { getDictionary } from "@/i18n";
import { useLang } from "./link";
import { NewsletterForm, SUBSCRIBED_KEY } from "./newsletter-form";

/** Seconds of reading, counted across pages in the same visit, before the invitation appears. */
const DELAY_SECONDS = 60;
/** After "close", stay quiet this many days in this browser. */
const QUIET_DAYS = 30;

const ELAPSED_KEY = "newsletter:elapsed";
const DISMISSED_KEY = "newsletter:dismissed";

function shouldStayQuiet() {
  try {
    if (localStorage.getItem(SUBSCRIBED_KEY)) return true;
    const dismissed = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    return Date.now() - dismissed < QUIET_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true; // storage blocked: never interrupt someone we cannot remember
  }
}

/**
 * A quiet invitation to the newsletter, after one minute of reading.
 * Not a modal: a card in the corner (a sheet on mobile) that does not block
 * the page, never steals focus, and closes with Esc or the X.
 * The minute only counts while the tab is visible, and keeps counting
 * when the visitor moves from one page to another.
 */
export function NewsletterPopup() {
  const lang = useLang();
  const t = getDictionary(lang).popup;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!site.newsletterAction || shouldStayQuiet()) return;
    let elapsed = 0;
    try {
      elapsed = Number(sessionStorage.getItem(ELAPSED_KEY) || 0);
    } catch {}
    if (elapsed >= DELAY_SECONDS) {
      setOpen(true);
      return;
    }
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      elapsed += 1;
      try {
        sessionStorage.setItem(ELAPSED_KEY, String(elapsed));
      } catch {}
      if (elapsed >= DELAY_SECONDS) {
        window.clearInterval(timer);
        setOpen(true);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {}
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <m.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="newsletter-popup-title"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem] sm:border print:hidden"
    >
      <button
        type="button"
        onClick={close}
        aria-label={t.close}
        className="absolute right-4 top-4 text-muted transition-colors duration-200 ease-out hover:text-foreground"
      >
        <X aria-hidden strokeWidth={1.25} className="size-5" />
      </button>
      <p className="meta">{t.eyebrow}</p>
      <h2 id="newsletter-popup-title" className="mt-2 pr-8 font-display text-3xl leading-[1.1] tracking-tight">
        {t.title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{t.text}</p>
      <div className="mt-5">
        <NewsletterForm lang={lang} idPrefix="newsletter-popup" onSubscribed={() => setTimeout(() => setOpen(false), 4000)} />
      </div>
    </m.aside>
  );
}
