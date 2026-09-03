# Pusat Hemodialisis SJAMK — website

## What this is
Bilingual (Bahasa Melayu default, English toggle) static marketing site for a private
haemodialysis centre aimed at a Kelantanese audience. Built with Eleventy. Content is
currently placeholder. The containing folder's name carries no meaning — ignore it.

## Visual design
Follows the "Doctorate" hospital template: bright blue `#3e8cff` + deep navy `#07306e` on
pale blue `#f3faff`, DM Sans throughout, blue circular icons (inline `<symbol>` sprite in
`base.njk`), navy full-width bands, `.scard`/`.bcard` grids, tracked-caps `.eyebrow` labels.
All tokens are CSS custom properties at the top of `src/assets/css/style.css`.

## Architecture (read this, don't re-explore)
- Eleventy: input `src/`, output `_site/`. Config + custom filters in `.eleventy.js`.
- Pages are `src/*.njk`; layouts in `src/_includes/layouts/`; partials in `src/_includes/partials/`.
- **All editable content is in `src/_data/*.json`.** UI strings + translations in `src/_data/i18n.json`.
- **Language toggle is client-side.** Pages render in Malay at build time; `src/assets/js/main.js`
  swaps text to English on toggle (localStorage key `sjamk-lang`). There is no `/en/` route.
- Blog: Markdown files in `src/blog/`, exposed as the `post` collection. Defaults in `src/blog/blog.json`.
- Contact details live ONLY in `src/_data/site.json`, inlined into `base.njk` as `#site-data`;
  `main.js` wires `[data-wa]` / `[data-tel]` / `[data-maps]` hrefs from it.

## Commands
- Install: `npm install` (Node 18+)
- Dev server: `npm run dev` → http://localhost:8080
- Build: `npm run build` → `_site/`
- Clean: `npm run clean`
- No test suite, no linter/formatter configured.

## Two translation mechanisms — use the right one
- `data-i18n="section.key"` → looked up in `i18n.json`. For fixed UI chrome.
- `data-i18n-obj` + `data-ms="..."` + `data-en="..."` → for text sourced from a data file
  (team roles, panel notes, hours, etc.).

## MUST / NEVER
- MUST run `npm run build` and confirm it succeeds before saying a change is done.
- MUST keep every key in `i18n.json` present in BOTH `ms` and `en` — a missing key silently
  breaks the toggle. (Quick check: the parity script pattern in git history / ask before merging.)
- MUST write new UI copy in Malay first, then add the English key.
- NEVER edit anything in `_site/` — it is generated.
- NEVER hardcode phone / WhatsApp / address in templates — edit `src/_data/site.json`.
- NEVER replace `PLACEHOLDER` text with invented facts (centre name, doctor names, MOH
  registration number, statistics, fares). Ask the user for the real value.

## Deliberate scope decisions — do not "helpfully" re-add
- No Waze links (Google Maps only).
- There is NO appointment form and NO subscribe field. Every "Buat Temujanji" / contact action is
  a `wa.me` or `tel:` link built by `main.js` from `site.json`. Don't add a form or a backend.
- No Kemudahan page, and no facilities/timeline blurb on `tentang.njk` (both removed).
  `tentang.njk` is: centered Latar Belakang + Misi/Visi cards, Nilai Kami as a two-column
  `.splitrow` (image + `.cards--2` value cards), centered Pensijilan.
- "Panel" means accepted insurer/agency panels (KWAP, PERKESO, MARA…), NOT a subsidy explainer.
  Each panel has a placeholder logo at `src/assets/img/panel/<slug>.svg` — replace with real logos.
- The centre is in **Pasir Mas, Kelantan** — address in `site.json`: Sek 1, Lot 824, Jalan
  Meranti, Kampung Mat Layin, 17000 Pasir Mas. Email `sjamk.hemodialisis@gmail.com`.
- Patient transport = pick-up/drop-off **within 20 km** of the centre, no price quoted.
- Nav has no "Beranda"/"Blog" item and no top contact bar; the nav CTA is a WhatsApp icon button.
- Home stats roll up on scroll (`.stat__num[data-count]`, `wireCounters()` in `main.js`).

## Custom Nunjucks filters (in .eleventy.js)
`tarikhBM` (Malay long date), `isoDate`, `limit`, `reverseCopy`, `json`, `excerpt`.

## Deeper docs
See `README.md` for the content-editing guide and how to add a monthly blog post.
