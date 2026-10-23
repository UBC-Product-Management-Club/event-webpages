# Product Jackpot

Event site for PMC's 24 Hour Product Challenge, Nov 21-22, 2026.

```bash
npm install
npm run dev      # local dev
npm run build    # outputs dist/
```

## Editing content
Everything editable is in `src/data/content.js`:
- `EVENT.registerUrl`: paste the registration link (until then the Register buttons show "opens soon").
- `EVENT.pricing`: paste pricing text, e.g. `"$10 per participant"` (until then "details coming soon").
- `SPONSORS`, `MENTORS`: add entries; the placeholder cards disappear automatically once the arrays have items.
- Headshots/logos go in `public/assets/people/` and `public/assets/sponsors/`.
- `EVENT.newsletterEndpoint`: POST URL for the footer newsletter form.

## Deploy (GitHub Pages)
1. Push to GitHub, then Settings, Pages, Source: **GitHub Actions**. The workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main`.
2. Custom domain: `public/CNAME` is set to `productjackpot.ubcpmc.com`. In your DNS add a `CNAME` record: `productjackpot` -> `<github-username>.github.io`. Then in Settings, Pages, enter the custom domain and tick Enforce HTTPS.
3. In Framer, add a redirect `/productjackpot` -> `https://productjackpot.ubcpmc.com`.
