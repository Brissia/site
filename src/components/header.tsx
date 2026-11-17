"use client";

import { Menu, Search, X } from "lucide-react";
import { Link } from "@/components/link";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/data/site";
import { getDictionary, localize, switchLanguagePath } from "@/i18n";
import { useLang } from "./link";
import { ThemeToggle } from "./theme";

export function Header() {
  const pathname = usePathname();
  const lang = useLang();
  const t = getDictionary(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => {
    const target = localize(href, lang);
    return pathname === target || pathname.startsWith(`${target}/`);
  };
  // The other language, on the same page. A plain link: the whole interface changes.
  const languageSwitch = (
    <NextLink
      href={switchLanguagePath(pathname, t.switchTo.lang)}
      hrefLang={t.switchTo.lang}
      lang={t.switchTo.lang}
      aria-label={t.switchTo.aria}
      className="meta grid h-10 min-w-10 place-items-center rounded-full px-2 transition-colors duration-200 ease-out hover:bg-hover hover:text-foreground"
    >
      {t.switchTo.label}
    </NextLink>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-background focus:px-3 focus:py-2"
      >
        {t.common.skip}
      </a>
      <div className="shell flex h-14 items-center justify-between md:h-16">
        <Link href="/" className="text-[15px] font-medium tracking-tight">
          {site.name}
        </Link>

        <nav aria-label={t.common.mainNav} className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[13px]">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="text-muted transition-colors duration-200 ease-out hover:text-foreground aria-[current=page]:text-foreground"
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="-mr-2 flex items-center">
          <Link
            href="/search"
            aria-label={t.common.search}
            className="grid size-10 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-hover"
          >
            <Search aria-hidden strokeWidth={1.25} className="size-[18px]" />
          </Link>
          {languageSwitch}
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            className="grid size-10 place-items-center rounded-full transition-colors duration-200 ease-out hover:bg-hover lg:hidden"
          >
            {open ? (
              <X aria-hidden strokeWidth={1.25} className="size-5" />
            ) : (
              <Menu aria-hidden strokeWidth={1.25} className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile: its own composition, a table of contents rather than a squeezed nav bar. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-background md:top-16 lg:hidden"
      >
        <nav aria-label={t.common.mobileNav} className="shell flex min-h-full flex-col justify-between pb-10 pt-8">
          <ol>
            {navigation.map((item, i) => (
              <li key={item.href} className="border-b border-border">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline gap-5 py-4"
                >
                  <span className="meta w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[2.25rem] leading-none tracking-tight">{t.nav[item.key]}</span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="meta mt-10">{site.base}</p>
        </nav>
      </div>
    </header>
  );
}
