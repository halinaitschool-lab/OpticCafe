# Vendor JavaScript

Local copies of third-party scripts for **Optic Café**. All run offline from this folder.

## Load order

| Order | File | Role |
|------:|------|------|
| 1 | `document-init.js` | Adds `w-mod-js` / `w-mod-touch` on `<html>` |
| 2 | `webfont.js` | Google Web Font Loader 1.6.26 |
| 3 | `webfont-config.js` | `WebFont.load({ google: { families: [...] } })` |
| 4 | `jquery.min.js` | Required by scroll-motion runtime |
| 5 | `scroll-motion.js` | Scroll interactions (`data-w-id`), menu, hovers (exposes `window.SiteMotion`) |
| 6 | `gsap.min.js` | GSAP 3.12.7 (homepage only) |
| 7 | `horizontal-loop.js` | Carousel loop helper (homepage only) |

Homepage (`index.html`) loads rows 1–7; project pages load 1–5 plus `js/main.js`.

## Updating scroll-motion.js

If you re-export the template and interactions change:

1. Download the latest runtime JS from the template export.
2. Replace `scroll-motion.js` (concatenate shared + site chunks if the export splits them).
3. Re-test hero, BTS, team, contact scroll, and menu on desktop (`≥992px`).

## Custom code (not in this folder)

- `js/main.js` + `js/modules/*` — accessibility, form, navigation, carousel wiring.
- `js/config/site-config.js` — business / SEO constants.
