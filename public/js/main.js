// --- Initialize map ---
const map = L.map("map").setView([39.5, -98.35], 4); // Center of US

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// --- Cities data ---
const cities = [
  { name: "New York", coords: [40.7128, -74.006] },
  { name: "Los Angeles", coords: [34.0522, -118.2437] },
  { name: "Chicago", coords: [41.8781, -87.6298] },
  { name: "New Orleans", coords: [29.9511, -90.0715] },
  { name: "Nashville", coords: [36.1627, -86.7816] },
  { name: "Providence", coords: [41.824, -71.4128] },
  { name: "Boston", coords: [42.3601, -71.0589] },
  { name: "Portland", coords: [45.5051, -122.675] },
  { name: "Houston", coords: [29.7604, -95.3698] },
  { name: "Austin", coords: [30.2672, -97.7431] },
  { name: "Dallas", coords: [32.7767, -96.797] },
  { name: "Columbus", coords: [39.9612, -82.9988] },
  { name: "San Diego", coords: [32.7157, -117.1611] },
  { name: "Seattle", coords: [47.6062, -122.3321] },
  { name: "Miami", coords: [25.7617, -80.1918] },
  { name: "Charlotte", coords: [35.2271, -80.8431] },
  { name: "Washington DC", coords: [38.9072, -77.0369] },
  { name: "St. Louis", coords: [38.627, -90.1994] },
  { name: "Kansas City", coords: [39.0997, -94.5786] },
  { name: "Philadelphia", coords: [39.9526, -75.1652] },
  { name: "Detroit", coords: [42.3314, -83.0458] },
  { name: "Atlanta", coords: [33.749, -84.388] },
  { name: "Memphis", coords: [35.1495, -90.049] },
  { name: "Cleveland", coords: [41.4993, -81.6944] },
  { name: "Baltimore", coords: [39.2904, -76.6122] },
  { name: "Denver", coords: [39.7392, -104.9903] },
  { name: "Minneapolis", coords: [44.9778, -93.265] },
  { name: "Las Vegas", coords: [36.1699, -115.1398] },
  { name: "San Francisco", coords: [37.7749, -122.4194] },
  { name: "Sacramento", coords: [38.5816, -121.4944] },
  { name: "Phoenix", coords: [33.4484, -112.074] },
  { name: "Tucson", coords: [32.2226, -110.9747] },
  { name: "Salt Lake City", coords: [40.7608, -111.891] },
  { name: "Albuquerque", coords: [35.0844, -106.6504] },
  { name: "Santa Fe", coords: [35.687, -105.9378] },
  { name: "Boulder", coords: [40.01499, -105.2705] },
  { name: "Indianapolis", coords: [39.7684, -86.1581] },
  { name: "Cincinnati", coords: [39.1031, -84.512] },
  { name: "Louisville", coords: [38.2527, -85.7585] },
  { name: "Pittsburgh", coords: [40.4406, -79.9959] },
  { name: "Raleigh", coords: [35.7796, -78.6382] },
  { name: "Durham", coords: [35.994, -78.8986] },
  { name: "Charleston", coords: [32.7765, -79.9311] },
  { name: "Savannah", coords: [32.0809, -81.0912] },
  { name: "Tampa", coords: [27.9506, -82.4572] },
  { name: "Orlando", coords: [28.5383, -81.3792] },
  { name: "Birmingham", coords: [33.5186, -86.8104] },
  { name: "Anchorage", coords: [61.2181, -149.9003] },
  { name: "Honolulu", coords: [21.3069, -157.8583] },
  { name: "Boise", coords: [43.615, -116.2023] },
  { name: "Des Moines", coords: [41.5868, -93.625] },
  { name: "Madison", coords: [43.0731, -89.4012] },
  { name: "Milwaukee", coords: [43.0389, -87.9065] },
  { name: "Omaha", coords: [41.2565, -95.9345] },
  { name: "Fargo", coords: [46.8772, -96.7898] },
  { name: "Sioux Falls", coords: [43.5446, -96.7311] },
  { name: "Burlington", coords: [44.4759, -73.2121] },
  { name: "Portsmouth", coords: [43.0718, -70.7626] },
  { name: "Little Rock", coords: [34.7465, -92.2896] },
  { name: "Jackson", coords: [32.2988, -90.1848] },
];

let flightLine;
let previousCity = null;

// --- Create map markers ---
cities.forEach((city) => {
  const marker = L.marker(city.coords).addTo(map);
  marker.bindPopup(`<b>${city.name}</b><br>Click to see top artists.`);

  marker.on("click", async () => {
    // Animate flight between cities
    if (previousCity && previousCity.name !== city.name) {
      if (flightLine) map.removeLayer(flightLine);

      const latlngs = [previousCity.coords, city.coords];
      flightLine = L.polyline(latlngs, {
        color: "#ff416c",
        weight: 3,
        opacity: 0.7,
        dashArray: "8, 12",
      }).addTo(map);

      // ✈️ animated plane
      const plane = L.marker(previousCity.coords, {
        icon: L.divIcon({ html: "✈️", className: "plane-icon" }),
      }).addTo(map);

      let step = 0;
      const steps = 50;
      const interval = setInterval(() => {
        step++;
        const lat =
          previousCity.coords[0] +
          (city.coords[0] - previousCity.coords[0]) * (step / steps);
        const lng =
          previousCity.coords[1] +
          (city.coords[1] - previousCity.coords[1]) * (step / steps);
        plane.setLatLng([lat, lng]);
        if (step >= steps) {
          clearInterval(interval);
          map.removeLayer(plane);
        }
      }, 50);
    }

    // Fly to selected city
    map.flyTo(city.coords, 8, { duration: 2 });

    await loadCityPlaylists(city.name);

    previousCity = city;
  });
});

// --- Reset map button ---
document.getElementById("reset-view").addEventListener("click", () => {
  map.flyTo([39.5, -98.35], 4, { duration: 2 });
  document.getElementById("city-name").innerText = "Click a city!";
  document.getElementById("artist-list").innerHTML = "";
});

// --- Fetch artists from backend ---
async function loadCityPlaylists(cityName) {
  const cityTitle = document.getElementById("city-name");
  const list = document.getElementById("playlist-list");

  cityTitle.innerText = `🎶 City Vibes: ${cityName}`;
  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch(`/city-playlists/${encodeURIComponent(cityName)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    list.innerHTML = "";
    if (!data.playlists || data.playlists.length === 0) {
      list.innerHTML = "<li>No playlists found for this city.</li>";
      return;
    }

    // Populate playlist list
    data.playlists.forEach((pl) => {
      const li = document.createElement("li");
      li.classList.add("playlist-item");
      li.innerHTML = `
        <div class="playlist-card">
          <img src="${pl.image || "placeholder.png"}" 
               alt="${pl.name}" 
               class="playlist-img" />
          <div class="playlist-info">
            <strong><a href="${pl.spotify_url}" target="_blank">${
        pl.name
      }</a></strong><br>
            <small>by ${pl.owner}</small><br>
            <span>${pl.description || "No description available"}</span><br>
            <small>${pl.track_count} tracks</small>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading playlists:", err);
    list.innerHTML = "<li>Error loading playlists. Try again later.</li>";
  }
}
