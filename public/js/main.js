// === GLOBAL STATE ===
let map;

// === INITIALIZE MAP ===
function initMap() {
  map = L.map("map").setView([39.5, -98.35], 4); // Center of US

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

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

  cities.forEach((city) => {
    const marker = L.marker(city.coords).addTo(map).bindPopup(city.name);
    marker.on("click", async () => {
      document.getElementById(
        "info"
      ).innerHTML = `<h2>🎵 ${city.name} Vibes</h2><p>Loading...</p>`;
      const res = await fetch(
        `/city-playlists/${encodeURIComponent(city.name)}`
      );
      const json = await res.json();
      renderPlaylists(json.playlists, city.name);
    });
  });
}

document.addEventListener("DOMContentLoaded", initMap);

// === RENDER PLAYLISTS ===
function renderPlaylists(playlists, label) {
  const info = document.getElementById("info");

  if (!playlists || playlists.length === 0) {
    info.innerHTML = `<h2>No playlists found for "${label}" 😢</h2>`;
    return;
  }

  info.innerHTML = `
    <h2>🎧 ${label} Playlists</h2>
    <div class="playlist-grid">
      ${playlists
        .map(
          (pl) => `
          <div class="playlist-card">
            <img src="${
              pl.image || "https://placehold.co/300x180?text=No+Image"
            }" alt="${pl.name}" />
            <div class="playlist-info">
              <h3>${pl.name}</h3>
              <p>${pl.description || "No description"}</p>
              <a href="${pl.spotify_url}" target="_blank">Open in Spotify →</a>
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

// === MODE SWITCHING ===
const modeGrid = document.getElementById("mode-grid");
const mapSection = document.getElementById("map-section");
const backHomeBtn = document.getElementById("back-home");

// === HELPER FUNCTIONS ===
function showMapMode() {
  modeGrid.classList.add("hidden");
  mapSection.classList.remove("hidden");
  document.getElementById("map").style.display = "block";
  document.getElementById("info").style.display = "block";
}

function showInfoOnlyMode(title) {
  modeGrid.classList.add("hidden");
  mapSection.classList.remove("hidden");
  document.getElementById("map").style.display = "none";
  document.getElementById("info").style.display = "block";
  document.getElementById("info").innerHTML = `<h2>${title}</h2>`;
}

function goHome() {
  mapSection.classList.add("hidden");
  modeGrid.classList.remove("hidden");
  document.getElementById("map").style.display = "none";
  document.getElementById("info").innerHTML = "";
}

backHomeBtn.addEventListener("click", goHome);

// === MAP MODE ===
document
  .getElementById("map-mode")
  .querySelector(".enter-mode")
  .addEventListener("click", () => {
    showMapMode();
    setTimeout(() => {
      map.invalidateSize();
      map.flyTo([39.5, -98.35], 4);
    }, 200);
  });

// === MOOD MODE ===
document
  .getElementById("mood-mode")
  .querySelector(".enter-mode")
  .addEventListener("click", async () => {
    showInfoOnlyMode("Pick a Mood 🎭");
    const moods = ["Happy", "Chill", "Focus", "Party", "Sad"];
    const buttons = moods
      .map((m) => `<button class="mood-btn" data-mood="${m}">${m}</button>`)
      .join(" ");
    document.getElementById("info").innerHTML += `<div>${buttons}</div>`;
    document.querySelectorAll(".mood-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const mood = e.target.dataset.mood;
        document.getElementById(
          "info"
        ).innerHTML = `<h2>🎭 ${mood}</h2><p>Loading...</p>`;
        const res = await fetch(`/mood-playlists/${encodeURIComponent(mood)}`);
        const json = await res.json();
        renderPlaylists(json.playlists, mood);
      })
    );
  });

// === GENRE MODE ===
document
  .getElementById("genre-mode")
  .querySelector(".enter-mode")
  .addEventListener("click", async () => {
    showInfoOnlyMode("Choose a Genre 🎸");
    const genres = ["Rock", "Pop", "Hip Hop", "Jazz", "Electronic"];
    const buttons = genres
      .map((g) => `<button class="mood-btn" data-genre="${g}">${g}</button>`)
      .join(" ");
    document.getElementById("info").innerHTML += `<div>${buttons}</div>`;
    document.querySelectorAll(".mood-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const genre = e.target.dataset.genre;
        document.getElementById(
          "info"
        ).innerHTML = `<h2>🎸 ${genre}</h2><p>Loading...</p>`;
        const res = await fetch(
          `/genre-playlists/${encodeURIComponent(genre)}`
        );
        const json = await res.json();
        renderPlaylists(json.playlists, genre);
      })
    );
  });

// === ERA MODE ===
document
  .getElementById("throwback-mode")
  .querySelector(".enter-mode")
  .addEventListener("click", async () => {
    showInfoOnlyMode("Pick a Throwback Era ⏳");
    const eras = ["1970s", "1980s", "1990s", "2000s", "2010s"];
    const buttons = eras
      .map((e) => `<button class="mood-btn" data-era="${e}">${e}</button>`)
      .join(" ");
    document.getElementById("info").innerHTML += `<div>${buttons}</div>`;
    document.querySelectorAll(".mood-btn").forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        const era = e.target.dataset.era;
        document.getElementById(
          "info"
        ).innerHTML = `<h2>⏳ ${era}</h2><p>Loading...</p>`;
        const res = await fetch(`/era-playlists/${encodeURIComponent(era)}`);
        const json = await res.json();
        renderPlaylists(json.playlists, era);
      })
    );
  });
