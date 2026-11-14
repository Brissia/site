import Script from "next/script";

/**
 * Cookieless page analytics (Plausible or Umami). Renders nothing until
 * NEXT_PUBLIC_ANALYTICS_SRC is set, so the default is no tracking at all.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!src) return null;
  return (
    <Script
      src={src}
      strategy="afterInteractive"
      data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN || undefined}
      data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_ID || undefined}
    />
  );
}
