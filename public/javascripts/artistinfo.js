// Wait until all artists are displayed before attaching click events
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const artistButtons = document.querySelectorAll(".artist-button");
    const infoContainer = document.getElementById("artist-info");
    const artistName = document.getElementById("artist-name");
    const artistPopularity = document.getElementById("artist-popularity");
    const artistImage = document.getElementById("artist-image");
    const artistPreview = document.getElementById("artist-preview");

    artistButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const name = button.textContent;

        // Fetch artist info from Spotify
        const token = localStorage.getItem("spotifyToken");
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const artist = data.artists.items[0];

        if (!artist) return;

        // Fetch top track for preview
        const tracksRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tracksData = await tracksRes.json();
        const topTrack = tracksData.tracks[0];

        // Fill artist info
        artistName.textContent = artist.name;
        artistPopularity.textContent = `Popularity: ${artist.popularity}`;
        artistImage.src = artist.images?.[0]?.url || "";
        artistPreview.src = topTrack?.preview_url || "";

        infoContainer.classList.remove("hidden");
      });
    });
  }, 1500); // Wait for artists to be loaded by script.js
});
