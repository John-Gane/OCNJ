# Interactive Map Data Guide

## Website files

- `map.js` — map behavior, filters, search, geolocation, nearest parking and popups.
- `data/map-locations.js` — curated businesses, parking lots, bridges, landmarks and nearby communities.
- `index.html` — visible map controls and map container.
- `style.css` — all map styling.

## Map technology

The map uses Leaflet, OpenStreetMap street tiles and optional Esri aerial imagery. It requires an internet connection to load those libraries and tiles.

## Independence disclaimer

The map is a private informational convenience tool. It is not an official City of Ocean City, county, state, bridge, transportation, parking, navigation or emergency map. Do not remove the disclaimer from the map or footer.

## Editing or adding a location

Open `data/map-locations.js` and copy one object. Keep every `id` unique.

```javascript
{
  "id": "unique-id",
  "name": "Business Name",
  "category": "dining",
  "icon": "○",
  "lat": 39.279,
  "lng": -74.575,
  "address": "Street address",
  "area": "Downtown",
  "description": "Short description.",
  "url": "https://official-site.com/",
  "directionsQuery": "Street address, Ocean City, NJ",
  "businessId": "matching-id-in-businesses-json",
  "locationQuality": "Address center"
}
```

Valid categories:

- `parking`
- `dining`
- `shopping`
- `recreation`
- `fitness`
- `bridge`
- `attraction`
- `nearby`

## Parking limitation

The pins show lot locations only. They do not provide live occupancy. The website links to Ocean City's official parking page and Parking Spot Finder information.

## Coordinates

Several intersection, bridge-approach and district pins are approximate practical centers. The directions button uses a text destination so Google Maps can resolve the current entrance or route.
