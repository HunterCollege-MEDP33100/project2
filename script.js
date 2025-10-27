// Initialize map
const map = L.map('map').setView([39.5, -98.35], 4); // Center of US

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// List of cities with coordinates
const cities = [
  { name: 'New York', coords: [40.7128, -74.006] },
  { name: 'Los Angeles', coords: [34.0522, -118.2437] },
  { name: 'Chicago', coords: [41.8781, -87.6298] },
  { name: 'New Orleans', coords: [29.9511, -90.0715] },
  { name: 'Nashville', coords: [36.1627, -86.7816] },
  { name: 'Providence', coords: [41.824, -71.4128] },
  { name: 'Boston', coords: [42.3601, -71.0589] },
  { name: 'Portland', coords: [45.5051, -122.675] },
  { name: 'Houston', coords: [29.7604, -95.3698] },
  { name: 'Austin', coords: [30.2672, -97.7431] },
  { name: 'Dallas', coords: [32.7767, -96.797] },
  { name: 'Columbus', coords: [39.9612, -82.9988] },
  { name: 'San Diego', coords: [32.7157, -117.1611] },
  { name: 'Seattle', coords: [47.6062, -122.3321] },
  { name: 'Miami', coords: [25.7617, -80.1918] },
  { name: 'Charlotte', coords: [35.2271, -80.8431] },
  { name: 'Washington DC', coords: [38.9072, -77.0369] },
  { name: 'St. Louis', coords: [38.627, -90.1994] },
  { name: 'Kansas City', coords: [39.0997, -94.5786] },
];

// Add city markers
cities.forEach((city) => {
  const marker = L.marker(city.coords).addTo(map);
  marker.bindPopup(`<b>${city.name}</b><br>Click to see artists.`);
  marker.on('click', () => loadCityArtists(city.name));
});

// Function to fetch artists (Spotify API placeholder)
async function loadCityArtists(cityName) {
  document.getElementById(
    'city-name'
  ).innerText = `🎧 Artists from ${cityName}`;
  const list = document.getElementById('artist-list');
  list.innerHTML = '<li>Loading...</li>';

  // Placeholder logic — replace with Spotify API call
  const artists = await getLocalArtists(cityName);

  list.innerHTML = '';
  if (artists.length === 0) {
    list.innerHTML = '<li>No artists found.</li>';
  } else {
    artists.forEach((artist) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${artist.name}</strong> ${
        artist.genre ? `(${artist.genre})` : ''
      }`;
      list.appendChild(li);
    });
  }
}

// Example placeholder function
async function getLocalArtists(city) {
  // In a real app, you’d use Spotify search API:
  // GET https://api.spotify.com/v1/search?q=city+artist&type=artist
  // For now, we’ll mock some data:
  const mockData = {
    Nashville: [
      { name: 'Chris Stapleton', genre: 'Country' },
      { name: 'Kacey Musgraves', genre: 'Country Pop' },
    ],
    Seattle: [
      { name: 'Pearl Jam', genre: 'Rock' },
      { name: 'Macklemore', genre: 'Hip Hop' },
    ],
  };
  return mockData[city] || [];
}
