# Helga House

Website for Helga House, a Shetland Sheepdog (Sheltie) home breeder. Built with [Astro](https://astro.build) and deployed on Vercel: static public pages plus a small back office at `/admin` for updating content. All copy is in Thai.

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # static build into dist/
npm run preview  # serve the build
npm run check    # type-check .astro and .ts files
```

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | One file per public page. `/`, `/puppies/` (waitlist), `/puppies/partners/`, `/puppies/program/`, `/our-dogs/`, `/sheltie/`, `/sheltie/health/`, `/sheltie/colors/`, `/journal/`, `/journal/[id]/`, `/contact/` |
| `src/pages/admin/` | The back office (server-rendered, password protected) |
| `src/lib/admin/` | Back office logic: login session, content read/write, GitHub storage |
| `src/layouts/` | `BaseLayout` (public pages) and `AdminLayout` (back office) |
| `src/components/` | Shared pieces: `Header`, `Footer`, `Photo`, `Icon`, `CtaBanner`, `JournalCard`, `FilterChips`, `ScamWarning` |
| `src/styles/global.css` | Design tokens (colours, fonts) and shared classes |
| `src/content/journal/` | Helga's journal, one Markdown file per post |
| `src/content/puppies/` | Partner-farm puppies, one JSON file each |
| `src/content/pages/` | Text and photos of each public page, one JSON file per page |
| `src/data/pageDefs.ts` | Which fields of each page are editable and how the back office labels them |
| `src/content/settings/site.json` | Brand name, contact details, Helga's status |
| `src/assets/images/` | Sample images. `src/assets/uploads/` holds photos uploaded from the back office |

## Back office (`/admin`)

Editors log in at `/admin` with one shared password and can:

- write, edit and delete journal posts (with a cover photo and gallery)
- add partner puppies and change their status
- edit the text and photos of every public page (`/admin/pages`)
- change contact details, Helga's timeline stage and profile

Public pages are static. Saving in the back office commits the changed files to this repository through the GitHub API; the host then rebuilds the site, so changes appear after a minute or two. There is no database.

Set these environment variables on the host (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Password for `/admin` |
| `GITHUB_TOKEN` | Fine-grained GitHub token with **Contents: Read and write** on this repository |

On Vercel the repository and branch are detected automatically. Running `ADMIN_PASSWORD=... npm run dev` without a token edits the files on local disk, which is how to try the back office locally.

## Things still to fill in

Text in `[square brackets]` on the site is a placeholder waiting for real content.

- **Contacts and Helga's details**: `/admin/settings`.
- **Journal and partner puppies**: the `sample-*` entries are placeholders; replace them from `/admin`.
- **Page copy** (for example the Sheltie colour descriptions): `/admin/pages`.
- **Domain**: set `site` in `astro.config.mjs` to get canonical URLs.
- **Forms**: the waitlist and contact forms POST to `PUBLIC_FORM_ENDPOINT`. Until it is set they send nothing and only show the thank-you message.

## Photos

Every image in `src/assets/images/` is AI-generated.

- On the knowledge pages they are used as illustrations and labelled "ภาพประกอบ".
- Slots that need a real photo (Helga, parents, partner puppies, journal) are marked `"temp": true` in the content files (`tempPhotos` / `tempPhoto` for journal posts and puppies). They currently show the temporary AI image so the site can be presented as a complete sample. These must be replaced with real photos before the public launch; set `PUBLIC_SHOW_TEMP_PHOTOS=false` to show a striped "รอรูปจริง" slot in their place instead.
- Uploading a photo from the back office replaces the temporary one and clears the flag. Every image needs Thai `alt` text; the back office asks for it next to each photo.

## Making more of a page editable

1. Add the field to the page's entry in `src/data/pageDefs.ts`.
2. Add its value to `src/content/pages/<page>.json`.
3. Read it in the page (`p.fieldName`). Use `rich()` for text, `photo()` for images.

Any mention of the training school (หมาสนุก) in text passed through `rich()` becomes a link to its site, styled to look like the surrounding text.
