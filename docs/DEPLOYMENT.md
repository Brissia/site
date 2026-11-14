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

The form posts directly to the provider, so there is no backend to run.

- **Buttondown**: set `NEXT_PUBLIC_NEWSLETTER_ACTION=https://buttondown.com/api/emails/embed-subscribe/<username>`.
- **Beehiiv**: use the form action URL from its embed settings. If Beehiiv only offers an iframe or script embed on your plan, replace the `<form>` in `src/components/footer.tsx` with it.

Until the variable is set the form is disabled and shows "Opens soon".

## 5. Analytics

Cookieless, no personal data. Nothing loads until `NEXT_PUBLIC_ANALYTICS_SRC` is set.

- **Umami** (free cloud tier or self-hosted): `NEXT_PUBLIC_ANALYTICS_SRC=https://cloud.umami.is/script.js` and `NEXT_PUBLIC_ANALYTICS_ID=<website id>`.
- **Plausible** (paid cloud, free if self-hosted): `NEXT_PUBLIC_ANALYTICS_SRC=https://plausible.io/js/script.js` and `NEXT_PUBLIC_ANALYTICS_DOMAIN=brissiabenavente.com`.

## 6. After the first deploy

- Run Lighthouse on the production URL, mobile profile. It has not been measured yet; see DECISIONS.md.
- Submit `https://brissiabenavente.com/sitemap.xml` in Google Search Console.
- Check the map on a phone and on desktop, in both themes.
