# Helga House

Website for Helga House, a Shetland Sheepdog (Sheltie) home breeder. Static site built with [Astro](https://astro.build); all copy is in Thai.

## Commands

```bash
npm install
npm run dev      # local dev server (temporary photos visible)
npm run build    # static build into dist/
npm run preview  # serve the build
npm run check    # type-check .astro and .ts files
```

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | One file per page. `/`, `/puppies/` (waitlist), `/puppies/partners/`, `/puppies/program/`, `/our-dogs/`, `/sheltie/`, `/sheltie/health/`, `/sheltie/colors/`, `/journal/`, `/journal/[id]/`, `/contact/` |
| `src/layouts/BaseLayout.astro` | HTML shell, fonts, header and footer |
| `src/components/` | Shared pieces: `Header`, `Footer`, `Photo`, `Icon`, `CtaBanner`, `JournalCard`, `FilterChips`, `ScamWarning` |
| `src/styles/global.css` | Design tokens (colours, fonts) and shared classes |
| `src/data/site.ts` | Brand name, contact details, timeline stage, feature switches |
| `src/data/partnerPuppies.ts` | Partner-farm puppy listings |
| `src/content/journal/` | Helga's journal, one Markdown file per post |
| `src/assets/images/` | Source images (resized and compressed at build time) |

## Things still to fill in

Text in `[square brackets]` on the site is a placeholder waiting for real content.

- **Brand and contacts**: `src/data/site.ts` (name, LINE, Facebook, phone, area, bank account name). The LINE/Facebook/phone links are `#` until set.
- **Domain**: set `site` in `astro.config.mjs` to get canonical URLs.
- **Forms**: the waitlist and contact forms POST to `PUBLIC_FORM_ENDPOINT`. Until it is set they send nothing and only show the thank-you message.
- **Journal**: the six `sample-*.md` posts are placeholders. Add `date` and `ageMonths` to the front matter when writing real ones.

## Photos

Every image in `src/assets/images/` is AI-generated.

- On the knowledge pages they are used as illustrations and labelled "ภาพประกอบ".
- Slots that need a real photo (Helga, parents, partner puppies, journal) are marked `temp` on `<Photo>` (or `tempPhotos: true` / `tempPhoto: true` in the data). These render the temporary image in `npm run dev` only; a build shows a striped "รอรูปจริง" slot instead, so AI images cannot go live in those places by accident. Set `PUBLIC_SHOW_TEMP_PHOTOS=true` to preview a build with them.
- When a real photo arrives: add it to `src/assets/images/`, point the slot at it, and remove the `temp` flag. Every image needs Thai `alt` text.
