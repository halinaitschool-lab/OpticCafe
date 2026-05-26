# Optic Café

Static website for **Optic Café** — salon optyczny w Poznaniu (ul. Garbary 65).

## Structure

```
css/
  main.css              # entry stylesheet (BEM + Webflow vendor styles)
  base/                 # design tokens and utilities
  vendor/webflow.css    # layout and animation styles from template
js/
  main.js               # app bootstrap (ES modules)
  config/site-config.js # business and SEO constants
  modules/              # navigation, form, accessibility, schema
  vendor/               # Webflow runtime, jQuery, fonts
project/                # offer detail pages
images/                 # local media assets
robots.txt
sitemap.xml
```

## Local preview

```bash
python3 -m http.server 8765
```

Open `http://localhost:8765`.

## SEO

- Polish meta tags, Open Graph, Twitter cards
- `LocalBusiness` + `Optician` JSON-LD on homepage
- `Service` JSON-LD on offer pages
- `robots.txt` and `sitemap.xml`

Update canonical URLs in `js/config/site-config.js` when deploying to your final domain.
