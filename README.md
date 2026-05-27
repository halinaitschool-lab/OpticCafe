# Optic Café

Static website for **Optic Café** — salon optyczny w Poznaniu (ul. Garbary 65).

## Structure

```
css/
  main.css              # entry stylesheet
  vendor/template-base.css  # template base + layout utilities
  base/                 # tokens, accessibility
  components/           # carousel, legal, process
js/
  main.js               # app bootstrap (ES modules)
  config/site-config.js # business and SEO constants
  modules/              # navigation, form, accessibility, carousel
  vendor/               # scroll-motion runtime, jQuery, fonts, GSAP (see vendor/README.md)
project/                # offer detail pages
polityka-prywatnosci.html
cookies.html
images/
robots.txt
sitemap.xml
```

## Local preview

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765` and hard-refresh (`Cmd+Shift+R`).

## Scroll motion

Page scroll animations use **`js/vendor/scroll-motion.js`**. The offer carousel uses local **GSAP** (`gsap.min.js` + `horizontal-loop.js`). See `js/vendor/README.md` for the full script list and load order.

## SEO & legal

- Polish meta tags, Open Graph, Twitter cards
- `LocalBusiness` + `Optician` JSON-LD on homepage
- Polityka prywatności and cookies pages (RODO)

Update canonical URLs in `js/config/site-config.js` when deploying to your final domain.
