# OCNJ.ETH Website — GitHub Repository: OCNJ

This package is configured for your GitHub repository named:

```text
OCNJ
```

The website files use relative paths, so no repository-name changes are required inside `index.html`, `style.css`, or `script.js`.

Your GitHub Pages address will follow this format:

```text
https://YOUR-GITHUB-USERNAME.github.io/OCNJ/
```

GitHub repository names are case-sensitive in the displayed URL, so keep `OCNJ` capitalized when testing the address.

---

# Is this an immediately usable website?

Yes. Once the files are uploaded and GitHub Pages is enabled, these features work immediately:

- Responsive homepage
- Mobile navigation
- Rosemary Beach / Greek coastal logo and design
- Rotating homepage spotlights
- Real Ocean City business links
- Verified local-favorites section
- Free, considered and indulgent filters
- Dining, shopping, recreation, fitness, water, land and air filters
- OCNJ.ETH editorial ratings
- Advertising-package section
- OCNJ.ETH ENS payment button and QR code
- Interactive island map with businesses, parking and bridge gateways
- Search, category filters, geolocation and nearest-parking tools
- Dedicated independence disclaimer and privacy pages
- Map and official-business links

## Current real businesses and destinations included

The package currently includes active links for:

- Shoppes at the Asbury
- Dockside Kitchen
- Ocean City Paddle Company
- Brown’s Restaurant
- Kessel’s Korner
- Bakeria 1010
- Stainton’s
- 7th Street Surf Shop
- Sweat.oc Studio
- Golden Galleon Pirate Golf
- Playland’s Castaway Cove
- Corson’s Inlet State Park

These links were checked against official business pages, current Ocean City visitor information, or current state information in July 2026.

Seasonal hours, prices and availability can still change. Review the links periodically.

---

# What still requires your information?

## 1. Your email address

Open both:

```text
index.html
script.js
```

Replace every occurrence of:

```text
YOUR-EMAIL@gmail.com
```

with your real email address.

Until that is replaced:

- Advertising inquiry buttons use a placeholder email.
- Listing requests use a placeholder email.
- The newsletter form uses a placeholder email.

## 2. A traditional card-payment link

The OCNJ.ETH crypto button and QR are included.

To accept card payments, add your real hosted payment link from:

- Stripe
- PayPal
- Venmo
- Givebutter
- Another secure provider

A hosted payment page is safer than collecting card information directly in this static website.

## 3. ENS verification

The included QR encodes:

```text
ethereum:OCNJ.eth
```

Before publishing the payment feature:

1. Open the official ENS manager.
2. Connect the wallet that owns `OCNJ.eth`.
3. Confirm the ETH address record points to your intended wallet.
4. Scan `assets/ocnj-eth-qr.png` with a compatible wallet.
5. Verify the resolved hexadecimal address.
6. Send a very small test transaction.
7. Confirm receipt.

Wallet support for ENS payment links varies. Crypto transfers are generally irreversible.

---

# Important static-site limitations

This is a polished active static website, but it does not yet include a database or administrative dashboard.

That means:

- Business hours do not update automatically.
- Prices do not update automatically.
- The newsletter form submits to Buttondown after you replace `YOUR-BUTTONDOWN-USERNAME`.
- Businesses cannot log in and edit their own profiles.
- Paid placements must be added manually in `script.js`.
- The site does not automatically detect whether someone has paid.

These features can later be connected through services such as Formspree, Mailchimp, Buttondown, Stripe Payment Links, Supabase or a headless CMS.

---

# Files to upload

Upload the entire package while preserving every folder name:

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

Do not rename `assets`, `data`, `scripts`, `reports`, `docs` or `.github`.

---

# Uploading the website to GitHub

## Upload the main files

Inside the `OCNJ` repository:

1. Select **Add file**.
2. Select **Upload files**.
3. Upload the complete extracted package, including:
   - `index.html`
   - `style.css`
   - `script.js`
   - `map.js`
   - `disclaimer.html`
   - `privacy.html`
   - `README.md`
   - `FILES-TO-UPLOAD.md`
   - `.nojekyll`
   - the complete `assets`, `data`, `scripts`, `reports`, `docs` and `.github` folders
4. Commit the files.

## Upload the assets folder

Upload the complete `assets` folder while preserving the folder name.

The website depends on relative paths such as:

```text
assets/logo.svg
assets/feature-paddle.svg
assets/ocnj-eth-qr.png
```

---

# Enable GitHub Pages

Inside the `OCNJ` repository:

1. Open **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch.
5. Select `/ (root)`.
6. Save.

The website address should be:

```text
https://YOUR-GITHUB-USERNAME.github.io/OCNJ/
```

---

# Controlling the homepage spotlight

Open:

```text
script.js
```

At the top, find:

```javascript
const FEATURED_ITEMS = [
```

The starter package now launches with three real editorial spotlights:

1. Shoppes at the Asbury
2. Dockside Kitchen
3. Ocean City Paddle Company

## Add a paid homepage spotlight

Copy one feature object and use:

```javascript
{
  kicker: "Partner spotlight",
  title: "Business name or campaign headline",
  description: "The paid partner message.",
  image: "assets/feature-partner.svg",
  imageAlt: "Description of the partner image",
  linkText: "Visit the featured partner",
  link: "https://BUSINESS-WEBSITE.com",
  sponsored: true
}
```

The setting:

```javascript
sponsored: true
```

automatically displays:

```text
Featured Partner
```

## Editorial feature

Use:

```javascript
sponsored: false
```

No paid badge will appear.

## Make a feature appear first

Move its complete object to the top of `FEATURED_ITEMS`.

## Show only one feature

Delete or comment out the other feature objects.

## Change the rotation speed

Find:

```javascript
8000
```

This means eight seconds.

For twelve seconds, use:

```javascript
12000
```

---

# Updating businesses and ratings

Open:

```text
script.js
```

Find:

```javascript
const EXPERIENCE_ITEMS = [
```

Each object controls one guide listing.

You can edit:

- Business or activity name
- Description
- Price tier
- Categories
- Official website
- Google Maps link
- Editorial ratings

Valid tiers:

```text
free
medium
premium
```

Valid categories:

```text
dining
shopping
recreation
fitness
water
land
air
```

The scores are OCNJ.ETH editorial-fit scores. They are not Google, Yelp or Tripadvisor ratings.

---

# Editorial and advertising policy

Paid sponsorship purchases:

- Visibility
- Placement
- Storytelling
- Campaign exposure

It should not guarantee:

- A favorable review
- A higher rating
- An editorial-favorite label

Paid homepage items should always use:

```javascript
sponsored: true
```

---

# Connect the newsletter to Buttondown

The website is now prepared to submit newsletter signups directly to Buttondown.

## Create the Buttondown newsletter

1. Create or open your newsletter in Buttondown.
2. Find the newsletter username or slug used in its public Buttondown address.
3. Open `index.html`.
4. Search for:

```text
YOUR-BUTTONDOWN-USERNAME
```

5. Replace it with the real Buttondown username.

Example:

```html
action="https://buttondown.com/api/emails/embed-subscribe/ocnj"
```

The form also sends this hidden tag:

```text
ocnj-website
```

That allows subscribers collected through this website to be identified inside Buttondown.

Do not place a Buttondown API key in `index.html`, `script.js`, GitHub or any browser-facing code.

## Testing Buttondown

After replacing the username:

1. Publish the updated site.
2. Enter an email address in the newsletter form.
3. Submit the form.
4. Complete Buttondown’s confirmation process if prompted.
5. Confirm the subscriber appears in the Buttondown dashboard.



---

# Automated business monitoring

The repository now includes a weekly GitHub Action.

## Files

```text
.github/workflows/business-monitor.yml
scripts/check_businesses.py
data/businesses.json
data/discovery-sources.json
data/business-status.json
data/discovered-listings.json
reports/business-monitor-latest.md
```

## What it does

Every Monday at 13:00 UTC (approximately 8:00 a.m. Eastern Standard Time or 9:00 a.m. Eastern Daylight Time), it:

1. Checks the official page for every tracked business.
2. Records HTTP errors and redirects.
3. Looks for expected business-name wording.
4. Looks for closure or temporary-closure wording.
5. Watches official Ocean City directory pages for newly appearing detail links.
6. Updates `data/business-status.json`.
7. Updates `reports/business-monitor-latest.md`.
8. Opens or updates a GitHub issue titled:

```text
Business monitor needs review
```

when something requires attention.

## Important limitation

The monitor reduces manual checking but cannot guarantee that a business is open or closed.

A business can:

- Close while leaving its website online.
- Temporarily lose its website while remaining open.
- Change its domain.
- Use seasonal closure language.
- Appear in a directory before opening.
- Leave a directory after a redesign.

For reliability, the system flags concerns for human review rather than automatically deleting businesses.

## Enable GitHub Actions

1. Open the `OCNJ` repository.
2. Open **Actions**.
3. Enable workflows if GitHub asks.
4. Open **Weekly OCNJ Business Monitor**.
5. Select **Run workflow** for the first check.
6. Open repository **Settings → Actions → General**.
7. Under workflow permissions, allow read and write permissions if the workflow cannot commit or create issues.

Scheduled workflows are defined in `.github/workflows` and use GitHub’s schedule trigger.

## Add a business to monitoring

Open:

```text
data/businesses.json
```

Copy an existing object and change:

```json
{
  "id": "short-unique-id",
  "name": "Business Name",
  "url": "https://official-business-site.com/",
  "expected_keywords": [
    "Business Name"
  ]
}
```

Use the official business page whenever possible.

---

# Independence and government disclaimer

OCNJ.ETH is a privately operated side project intended to help visitors and local businesses. It is not affiliated with, endorsed by, sponsored by, operated by or an official publication of the City of Ocean City, New Jersey, or any county, state, tourism, parking, bridge, transportation or other government body.

Do not remove:

- The top-of-page independent-guide notice
- The interactive-map disclaimer
- The footer disclaimer
- `disclaimer.html`
- The link to the official city website

For official government information, direct visitors to `https://www.ocnj.us/`.
