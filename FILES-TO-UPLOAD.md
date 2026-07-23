# Exact Files to Upload to GitHub

Repository name: `OCNJ`

Upload the complete contents of the ZIP and preserve this structure:

```text
OCNJ/
├── index.html
├── style.css
├── script.js
├── map.js
├── disclaimer.html
├── privacy.html
├── README.md
├── FILES-TO-UPLOAD.md
├── .nojekyll
├── assets/
│   ├── logo.svg
│   ├── logo-light.svg
│   ├── favicon.svg
│   ├── hero-greece-ocnj.svg
│   ├── feature-morning.svg
│   ├── feature-brunch.svg
│   ├── feature-partner.svg
│   ├── feature-paddle.svg
│   ├── category-dining.svg
│   ├── category-shopping.svg
│   ├── category-recreation.svg
│   ├── category-wellness.svg
│   ├── category-local.svg
│   ├── partner-beach.svg
│   ├── support.svg
│   ├── newsletter.svg
│   └── ocnj-eth-qr.png
├── data/
│   ├── businesses.json
│   ├── business-status.json
│   ├── discovered-listings.json
│   ├── discovery-sources.json
│   └── map-locations.js
├── scripts/
│   └── check_businesses.py
├── reports/
│   └── business-monitor-latest.md
├── docs/
│   ├── BUSINESS-OPERATIONS.md
│   ├── MAP-DATA-GUIDE.md
│   └── TAX-STARTUP-CHECKLIST.md
└── .github/
    └── workflows/
        └── business-monitor.yml
```

## Main files

- `index.html` — homepage, map controls, disclaimers and visible content.
- `style.css` — complete visual design, responsive layout, map and legal-page styling.
- `script.js` — homepage features, guide filters and business-monitor display.
- `map.js` — interactive map behavior.
- `data/map-locations.js` — map pins and bridge-route data.
- `disclaimer.html` — full independent-project and information disclaimer.
- `privacy.html` — newsletter, geolocation, map and hosting privacy notice.

## Before publishing

Replace in `index.html` and any other listed file:

- `YOUR-EMAIL@gmail.com`
- `YOUR-BUTTONDOWN-USERNAME`

Then test the OCNJ.ETH QR with a small transaction before accepting payments.
