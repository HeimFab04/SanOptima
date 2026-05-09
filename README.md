# SanOptima frontend prototype

SanOptima is a premium health-tech landing site and product prototype for testing interest in a personalized health intelligence platform.

Tagline: **Optimize your health. Elevate your life.**

This is frontend-only. It does not include a backend, authentication, database, wearable integrations, medical logic, or real user accounts.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Vercel-ready static deployment

## What is included

- Landing page with sticky navigation
- Customer-journey narrative from pain points to solution
- Vision, mission, ecosystem, trust, testing, and founding team sections
- Product sections wired for final prototype images
- Frankfurt in-lab blood testing map block
- At-home blood patch / home testing section
- Waitlist form
- Feedback form
- Multi-step questionnaire
- Thank-you states
- FAQ
- Footer

## Run locally

```bash
npm install
npm run dev
```

Vite will print a local URL, usually:

```bash
http://localhost:5173
```

## Build for production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Form endpoints

Form URLs are configured in:

```txt
src/config.ts
```

Add Formspree, Tally, Typeform, or another form endpoint later:

```ts
export const formConfig = {
  WAITLIST_FORM_URL: 'https://your-form-endpoint',
  FEEDBACK_FORM_URL: 'https://your-form-endpoint',
  QUESTIONNAIRE_FORM_URL: 'https://your-form-endpoint',
}
```

If a URL is empty, the form still works as a local prototype and shows a fake success state. This lets you share the site before the final form provider is selected.

## Website assets

The redesigned site expects final images in:

```txt
public/assets/
```

Use these filenames so the site can load the official visual system automatically:

```txt
sanoptima-logo.png
sanoptima-blood-patch.png
prototype-dashboard.png
prototype-wearables.png
prototype-biomarkers.png
prototype-insights.png
prototype-recommendations.png
prototype-programs.png
prototype-nutrition.png
prototype-alerts.png
prototype-supplements.png
team-founder-1.png
team-founder-2.png
team-founder-3.png
team-founder-4.png
team-founder-5.png
```

The asset references are centralized near the top of:

```txt
src/App.tsx
```

If you prefer different filenames, update the `assets` object there.

## Deploy to Vercel

1. Push this project to GitHub, GitLab, or Bitbucket.
2. Create a new Vercel project.
3. Import the repository.
4. Use the default Vite settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy.

## Connect sanoptima.de in Vercel

1. Open the Vercel project.
2. Go to **Settings -> Domains**.
3. Add `sanoptima.de`.
4. Add `www.sanoptima.de` as well if you want the www version to work.
5. Vercel will show the exact DNS records required for the project.
6. Add those records in IONOS.
7. Wait for DNS propagation.
8. Return to Vercel and verify the domain.

SSL should be handled automatically by Vercel once DNS is correct.

### Connecting sanoptima.de from IONOS to Vercel

- Add the domain in Vercel project settings.
- For apex/root domain `sanoptima.de`, point the A record to Vercel's required IP shown in the Vercel dashboard.
- For `www`, add the CNAME Vercel requests.
- Remove or replace the old A record currently pointing to another IP if needed.
- Keep MX / SPF / DKIM mail records unchanged if email is hosted separately.
- Wait for DNS propagation.
- Verify domain in Vercel.

Important: do not copy an old IPv4 address into this project. Your current IONOS A record for `@` may point somewhere else; replace it with the Vercel value shown in Vercel when you connect the domain.

## IONOS DNS notes

In IONOS, open the DNS settings for `sanoptima.de`.

Typical Vercel setup:

- `@` / apex domain: A record to the Vercel IP shown in your Vercel dashboard.
- `www`: CNAME record to the Vercel hostname shown in your Vercel dashboard.

Do not delete mail records if email is hosted separately:

- MX
- SPF TXT
- DKIM TXT
- DMARC TXT

DNS changes can take minutes to several hours to propagate.

## Editing product sections later

Product sections are defined in the `platformSections` array in `src/App.tsx`. Each section has copy and a matching image key from the centralized `assets.product` map.
