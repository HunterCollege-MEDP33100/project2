// Wait until all content is loaded
document.addEventListener("DOMContentLoaded", () => {
  const artistInfoContainer = document.getElementById("artist-info");
  const artistImage = document.getElementById("artist-image");
  const artistName = document.getElementById("artist-name");
  const artistPopularity = document.getElementById("artist-popularity");
  const artistPreview = document.getElementById("artist-preview");

  // Wait for artist buttons to exist
  const observer = new MutationObserver(() => {
    const artistButtons = document.querySelectorAll(".artist-button");

    artistButtons.forEach(button => {
      // Avoid duplicate listeners
      button.removeEventListener("click", handleArtistClick);
      button.addEventListener("click", handleArtistClick);
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  async function handleArtistClick(event) {
    const artistNameClicked = event.target.textContent;

    // Fetch token
    const token = localStorage.getItem("spotifyToken");

    if (!token) {
      alert("Spotify token not found. Please refresh the page.");
      return;
    }

    // Get artist info
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistNameClicked)}&type=artist`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const searchData = await searchResponse.json();
    const artist = searchData.artists.items[0];

    if (!artist) {
      alert("Artist not found.");
      return;
    }

    // Get one top track for preview
    const trackResponse = await fetch(
      console.log('track got')
        `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const trackData = await trackResponse.json();
    const previewUrl = trackData.tracks[0]?.preview_url || null;

    // Update the UI
    artistImage.src = artist.images?.[0]?.url || "";
    artistName.textContent = artist.name;
    artistPopularity.textContent = `Popularity: ${artist.popularity}`;
    artistPreview.src = previewUrl;

    // Show container
    artistInfoContainer.classList.remove("hidden");
  }
});
