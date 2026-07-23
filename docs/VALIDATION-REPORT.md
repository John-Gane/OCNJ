# OCNJ.ETH Final Validation Report

Validation date: July 22, 2026

## Completed checks

- Parsed `index.html`, `disclaimer.html` and `privacy.html`.
- Confirmed no duplicate HTML IDs.
- Confirmed every local image, script, stylesheet and page reference exists.
- Ran JavaScript syntax checks on `script.js`, `map.js` and `data/map-locations.js`.
- Compiled `scripts/check_businesses.py` successfully.
- Parsed the GitHub Actions workflow successfully.
- Removed the unsupported GitHub Actions `timezone` field and converted the schedule to valid UTC cron syntax.
- Confirmed 41 unique map locations and four bridge-route overlays.
- Confirmed every map `businessId` matches a monitored business ID.
- Confirmed map categories and search/filter controls are wired consistently.
- Confirmed the independent-project disclaimer appears at the top of the site, beside the map, in a dedicated disclosure section, in the footer and on `disclaimer.html`.
- Confirmed the monitor never deletes a listing automatically.
- Reset the business-monitor data to a clean pre-launch baseline so a blocked local test does not create false closure warnings.

## Items the site owner must replace

- `YOUR-EMAIL@gmail.com`
- `YOUR-BUTTONDOWN-USERNAME`
- Any future Stripe or other hosted payment link

## Manual launch checks

- Test the Buttondown form after adding the username.
- Scan and test the OCNJ.ETH QR with a very small transaction.
- Run the GitHub workflow manually once after upload.
- Review map pins and official parking information seasonally.
- Confirm sponsored items use `sponsored: true`.

- Added `.github/workflows/pages.yml` using official Pages deployment actions so normal commits and completed monitoring runs publish the current site.
