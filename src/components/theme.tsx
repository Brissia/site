"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { getDictionary } from "@/i18n";
import { useLang } from "./link";

/**
 * Runs before paint so there is no flash. Follows the system unless the
 * visitor has chosen a mode, and keeps following it if the system changes.
 */
export const themeScript = `(function(){try{var d=document.documentElement,s=localStorage.getItem('theme'),m=matchMedia('(prefers-color-scheme: dark)');d.dataset.theme=(s==='dark'||s==='light')?s:(m.matches?'dark':'light')}catch(e){}})()`;

export function ThemeToggle() {
  const label = getDictionary(useLang()).common.theme;
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.dataset.theme = media.matches ? "dark" : "light";
      }
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-hover"
    >
      <Sun aria-hidden strokeWidth={1.25} className="size-[18px] [[data-theme=dark]_&]:hidden" />
      <Moon aria-hidden strokeWidth={1.25} className="hidden size-[18px] [[data-theme=dark]_&]:block" />
    </button>
  );
}
