/*
=========================================================
OCNJ.ETH INTERACTIVE MAP
=========================================================

Data source:
  data/map-locations.js

Libraries:
  Leaflet 1.9.4
  Leaflet.markercluster 1.5.3

The map is informational and independently operated. It is
not an official City of Ocean City or government map.
*/

(() => {
  const mapElement = document.getElementById("ocnjMap");

  if (!mapElement) return;

  const locations = Array.isArray(window.OCNJ_MAP_LOCATIONS)
    ? window.OCNJ_MAP_LOCATIONS
    : [];
  const bridgeRoutes = Array.isArray(window.OCNJ_BRIDGE_ROUTES)
    ? window.OCNJ_BRIDGE_ROUTES
    : [];

  const statusElement = document.getElementById("mapStatus");
  const resultsElement = document.getElementById("mapResults");
  const searchInput = document.getElementById("mapSearch");
  const filterButtons = document.querySelectorAll(".map-filter-button");
  const locateButton = document.getElementById("mapLocateButton");
  const nearestParkingButton = document.getElementById("mapNearestParkingButton");
  const fitButton = document.getElementById("mapFitButton");
  const focusButtons = document.querySelectorAll("[data-map-focus]");

  if (typeof L === "undefined") {
    statusElement.textContent =
      "The map library could not load. Check the internet connection.";
    return;
  }

  const fullBounds = L.latLngBounds(
    [39.185, -74.680],
    [39.345, -74.505]
  );

  const map = L.map(mapElement, {
    center: [39.267, -74.602],
    zoom: 12,
    minZoom: 10,
    maxZoom: 19,
    scrollWheelZoom: true,
    preferCanvas: true
  });

  const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(map);

  const aerialLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution:
        "Tiles &copy; Esri, Maxar, Earthstar Geographics and contributors"
    }
  );

  L.control.layers(
    {
      "Street map": streetLayer,
      "Aerial imagery": aerialLayer
    },
    {},
    {
      position: "topright",
      collapsed: true
    }
  ).addTo(map);

  L.control.scale({
    imperial: true,
    metric: false
  }).addTo(map);

  const clusterLayer =
    typeof L.markerClusterGroup === "function"
      ? L.markerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 48
        })
      : L.layerGroup();

  clusterLayer.addTo(map);

  const routeLayer = L.layerGroup().addTo(map);
  const markerById = new Map();
  const businessStatusById = new Map();

  let activeCategory = "all";
  let searchQuery = "";
  let userLatLng = null;
  let userMarker = null;
  let nearestParkingMode = false;

  const categoryLabels = {
    parking: "Parking",
    dining: "Dining",
    shopping: "Shopping",
    recreation: "Recreation",
    fitness: "Fitness",
    bridge: "Bridge / gateway",
    attraction: "Landmark",
    nearby: "Nearby area"
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function directionsUrl(location) {
    const destination =
      location.directionsQuery || `${location.lat},${location.lng}`;

    return (
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(destination)
    );
  }

  function currentStatus(location) {
    if (!location.businessId) {
      return {
        state: "healthy",
        label: "Curated informational map point"
      };
    }

    const monitorStatus = businessStatusById.get(location.businessId);

    if (!monitorStatus) {
      return {
        state: "healthy",
        label: "Awaiting the first automated website check"
      };
    }

    if (monitorStatus.status === "healthy") {
      return {
        state: "healthy",
        label: "Official page passed the latest automated check"
      };
    }

    return {
      state: "review",
      label: "Listing needs human review"
    };
  }

  function markerIcon(location) {
    const status = currentStatus(location);
    const reviewClass = status.state === "review" ? " review" : "";

    return L.divIcon({
      className: "ocnj-div-icon",
      html: `
        <div class="ocnj-map-marker ${escapeHtml(
          location.category
        )}${reviewClass}">
          <span>${escapeHtml(location.icon || "•")}</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -30]
    });
  }

  function popupHtml(location) {
    const status = currentStatus(location);
    const officialLink = location.url
      ? `
        <a
          class="secondary"
          href="${escapeHtml(location.url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official info
        </a>
      `
      : "";

    return `
      <div class="map-popup">
        <p class="map-popup-kicker">
          ${escapeHtml(categoryLabels[location.category] || location.category)}
          • ${escapeHtml(location.area || "Ocean City")}
        </p>

        <h3>${escapeHtml(location.name)}</h3>

        <p class="map-popup-address">
          ${escapeHtml(location.address || "")}
        </p>

        <p class="map-popup-description">
          ${escapeHtml(location.description || "")}
        </p>

        <span class="map-popup-status ${status.state}">
          ${escapeHtml(status.label)}
        </span>

        <div class="map-popup-links">
          <a
            href="${directionsUrl(location)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions
          </a>
          ${officialLink}
        </div>
      </div>
    `;
  }

  function createMarkers() {
    locations.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        title: location.name,
        icon: markerIcon(location)
      });

      marker.locationData = location;
      marker.bindPopup(popupHtml(location), {
        maxWidth: 310
      });

      markerById.set(location.id, marker);
    });
  }

  function refreshMarkerPresentation() {
    markerById.forEach((marker) => {
      marker.setIcon(markerIcon(marker.locationData));
      marker.setPopupContent(popupHtml(marker.locationData));
    });
  }

  function drawBridgeRoutes() {
    bridgeRoutes.forEach((route) => {
      L.polyline(route.coordinates, {
        color: "#d36e55",
        weight: 4,
        opacity: 0.7,
        dashArray: "8 9"
      })
        .bindTooltip(route.name, { sticky: true })
        .addTo(routeLayer);
    });
  }

  function radians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function distanceMiles(from, to) {
    const radius = 3958.8;
    const deltaLat = radians(to.lat - from.lat);
    const deltaLng = radians(to.lng - from.lng);
    const lat1 = radians(from.lat);
    const lat2 = radians(to.lat);
    const value =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) ** 2;

    return (
      2 *
      radius *
      Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
    );
  }

  function searchableText(location) {
    return [
      location.name,
      location.category,
      categoryLabels[location.category],
      location.address,
      location.area,
      location.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function getVisibleLocations() {
    let filtered = locations.filter((location) => {
      const categoryMatches =
        activeCategory === "all" ||
        location.category === activeCategory;
      const searchMatches =
        !searchQuery ||
        searchableText(location).includes(searchQuery);

      return categoryMatches && searchMatches;
    });

    if (nearestParkingMode && userLatLng) {
      filtered = filtered
        .filter((location) => location.category === "parking")
        .map((location) => ({
          ...location,
          distance: distanceMiles(userLatLng, {
            lat: location.lat,
            lng: location.lng
          })
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 8);
    } else if (userLatLng) {
      filtered = filtered.map((location) => ({
        ...location,
        distance: distanceMiles(userLatLng, {
          lat: location.lat,
          lng: location.lng
        })
      }));
    }

    return filtered;
  }

  function renderResults(visible) {
    if (!resultsElement) return;

    const limit = nearestParkingMode ? 8 : 35;
    const shown = visible.slice(0, limit);

    resultsElement.innerHTML = shown
      .map((location) => {
        const distanceText =
          typeof location.distance === "number"
            ? `${location.distance.toFixed(1)} mi`
            : "";

        return `
          <button
            class="map-result-button"
            type="button"
            data-location-id="${escapeHtml(location.id)}"
          >
            <span class="map-result-icon">
              ${escapeHtml(location.icon || "•")}
            </span>

            <span class="map-result-copy">
              <strong>${escapeHtml(location.name)}</strong>
              <span>
                ${escapeHtml(
                  categoryLabels[location.category] || location.category
                )} • ${escapeHtml(location.area || "Ocean City")}
              </span>
            </span>

            <span class="map-result-distance">
              ${escapeHtml(distanceText)}
            </span>
          </button>
        `;
      })
      .join("");

    resultsElement.querySelectorAll("[data-location-id]").forEach((button) => {
      button.addEventListener("click", () => {
        focusLocation(button.dataset.locationId);
      });
    });
  }

  function renderMap() {
    const visible = getVisibleLocations();
    clusterLayer.clearLayers();

    visible.forEach((location) => {
      const marker = markerById.get(location.id);
      if (marker) clusterLayer.addLayer(marker);
    });

    const context =
      nearestParkingMode && userLatLng
        ? `Showing the ${visible.length} nearest curated municipal parking points.`
        : `Showing ${visible.length} of ${locations.length} curated map locations.`;

    statusElement.textContent = context;
    renderResults(visible);
  }

  function focusLocation(id) {
    const marker = markerById.get(id);
    if (!marker) return;

    const location = marker.locationData;
    map.setView([location.lat, location.lng], location.category === "nearby" ? 13 : 16, {
      animate: true
    });

    window.setTimeout(() => marker.openPopup(), 300);
  }

  function requestLocation(callback) {
    if (!navigator.geolocation) {
      statusElement.textContent =
        "Location is not supported by this browser.";
      return;
    }

    statusElement.textContent = "Requesting your location…";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const userIcon = L.divIcon({
          className: "ocnj-div-icon",
          html: '<div class="user-location-marker"></div>',
          iconSize: [19, 19],
          iconAnchor: [9, 9]
        });

        if (userMarker) {
          userMarker.setLatLng(userLatLng);
        } else {
          userMarker = L.marker(userLatLng, {
            icon: userIcon,
            zIndexOffset: 1000
          })
            .bindPopup("Your approximate location")
            .addTo(map);
        }

        map.setView(userLatLng, 14, { animate: true });
        if (typeof callback === "function") callback();
        else renderMap();
      },
      (error) => {
        statusElement.textContent =
          error.code === error.PERMISSION_DENIED
            ? "Location permission was declined."
            : "Your location could not be determined.";
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  }

  function showNearestParking() {
    const run = () => {
      nearestParkingMode = true;
      activeCategory = "parking";
      searchQuery = "";
      if (searchInput) searchInput.value = "";

      filterButtons.forEach((button) => {
        button.classList.toggle(
          "active",
          button.dataset.mapCategory === "parking"
        );
      });

      renderMap();

      const nearest = getVisibleLocations()[0];
      if (nearest) {
        const marker = markerById.get(nearest.id);
        const bounds = L.latLngBounds([
          [userLatLng.lat, userLatLng.lng],
          [nearest.lat, nearest.lng]
        ]);
        map.fitBounds(bounds.pad(0.45), {
          maxZoom: 16,
          animate: true
        });
        window.setTimeout(() => marker && marker.openPopup(), 300);
      }
    };

    if (userLatLng) run();
    else requestLocation(run);
  }

  async function loadBusinessStatuses() {
    try {
      const response = await fetch("data/business-status.json", {
        cache: "no-store"
      });
      if (!response.ok) return;

      const data = await response.json();
      (data.businesses || []).forEach((business) => {
        businessStatusById.set(business.id, business);
      });

      refreshMarkerPresentation();
      renderMap();
    } catch (error) {
      // The map still works when the monitor status file is unavailable.
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      nearestParkingMode = false;
      activeCategory = button.dataset.mapCategory;

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      renderMap();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      nearestParkingMode = false;
      searchQuery = searchInput.value.trim().toLowerCase();
      renderMap();
    });
  }

  if (locateButton) {
    locateButton.addEventListener("click", () => {
      nearestParkingMode = false;
      requestLocation();
    });
  }

  if (nearestParkingButton) {
    nearestParkingButton.addEventListener("click", showNearestParking);
  }

  if (fitButton) {
    fitButton.addEventListener("click", () => {
      nearestParkingMode = false;
      map.fitBounds(fullBounds, {
        padding: [20, 20],
        animate: true
      });
      renderMap();
    });
  }

  focusButtons.forEach((button) => {
    button.addEventListener("click", () => {
      nearestParkingMode = false;
      focusLocation(button.dataset.mapFocus);
    });
  });

  createMarkers();
  drawBridgeRoutes();
  map.fitBounds(fullBounds, { padding: [15, 15] });
  renderMap();
  loadBusinessStatuses();

  window.setTimeout(() => map.invalidateSize(), 250);
})();
