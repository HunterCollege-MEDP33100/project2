document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('artist-button')) {
    const artistName = event.target.textContent;

    
    document.querySelectorAll('.artist-button').forEach(btn => {
      btn.classList.remove('active');
    });

    event.target.classList.add('active');

   
    // Get token
    const token = localStorage.getItem('spotifyToken');
    if (!token) return;

    // Fetch artist info from Spotify API
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const searchData = await searchResponse.json();
    const artist = searchData.artists.items[0];
    if (!artist) return;

    // Update artist info section
    const infoSection = document.getElementById('artist-info');
    const artistImg = document.getElementById('artist-image');
    const artistNameEl = document.getElementById('artist-name');
    const artistPopularity = document.getElementById('artist-popularity');
    const artistPreview = document.getElementById('artist-preview');

    artistImg.src = artist.images?.[0]?.url || '';
    artistNameEl.textContent = artist.name;
    artistPopularity.textContent = `Popularity: ${artist.popularity}`;

    // Fetch artist top tracks (for preview audio)
    const tracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tracksData = await tracksResponse.json();

    // Get first preview available
    const previewTrack = tracksData.tracks.find(t => t.preview_url);
    artistPreview.src = previewTrack ? previewTrack.preview_url : '';

    // Show section below artist buttons
    infoSection.classList.remove('hidden');
    setTimeout(() => {
      infoSection.classList.add('visible');
    }, 10);
  }
});

