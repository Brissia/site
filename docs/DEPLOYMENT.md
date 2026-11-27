# Deployment

Everything below fits in free tiers. The only cost in the whole setup is the domain name.

## 1. GitHub

```bash
git remote add origin git@github.com:<your-user>/brissiabenavente.git
git push -u origin main
git push -u origin development
```

## 2. Vercel

1. vercel.com, "Add New Project", import the repository. Framework is detected as Next.js; no settings to change.
2. Add the environment variables from `.env.example` (at least `NEXT_PUBLIC_SITE_URL`, set to the Vercel URL for now).
3. Deploy. `main` is production; every other branch and pull request gets its own preview URL.

## 3. Domain

Buy `brissiabenavente.com` at any registrar (Cloudflare Registrar and Porkbun sell at or near cost). In Vercel: Project, Settings, Domains, add the domain and copy the DNS records it shows into the registrar. Then update `NEXT_PUBLIC_SITE_URL` and redeploy so canonical URLs, sitemap and RSS use the new address.

Nothing in the code depends on Vercel. It is a standard Next.js app and runs on Netlify, Cloudflare or any Node host.

## 4. Newsletter

The newsletter runs on Kit (form "Newsletter site", id 10251338). Both the footer form and the popup post straight to Kit through a hidden iframe, so there is no backend and the visitor never leaves the page. New subscribers land in that form in Kit, which sends its confirmation email.

- The endpoint lives in `src/data/site.ts` (`newsletterAction`). To use another form, set `NEXT_PUBLIC_NEWSLETTER_ACTION=https://app.kit.com/forms/<form id>/subscriptions` in Vercel.
- **Popup** (`src/components/newsletter-popup.tsx`): appears after 60 seconds of reading, counted across pages in the same visit and only while the tab is visible. It is a card in the corner (a bottom sheet on mobile), not a modal: it does not block the page or take focus, and closes with Esc. After "close" it stays quiet for 30 days in that browser; after subscribing, it never shows again. `DELAY_SECONDS` and `QUIET_DAYS` at the top of the file change both.
- Texts in both languages: `footer` and `popup` in `src/i18n/dictionaries.ts`.

## 5. Analytics

Cookieless, no personal data. Nothing loads until `NEXT_PUBLIC_ANALYTICS_SRC` is set.

- **Umami** (free cloud tier or self-hosted): `NEXT_PUBLIC_ANALYTICS_SRC=https://cloud.umami.is/script.js` and `NEXT_PUBLIC_ANALYTICS_ID=<website id>`.
- **Plausible** (paid cloud, free if self-hosted): `NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js` and `NEXT_PUBLIC_ANALYTICS_DOMAIN=brissiabenavente.com`.

## 6. After the first deploy

- Run Lighthouse on the production URL, mobile profile. It has not been measured yet; see DECISIONS.md.
- Submit `https://brissiabenavente.com/sitemap.xml` in Google Search Console.
- Check the map on a phone and on desktop, in both themes.
