// Attach event listener to artist buttons after they are created
document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('artist-button')) {
    const artistName = event.target.textContent;

    // Remove highlight from all buttons, then highlight the clicked one
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
    const detailsDiv = document.querySelector('.artist-details');

    artistImg.src = artist.images?.[0]?.url || '';
    artistNameEl.textContent = artist.name;
    artistPopularity.textContent = `Popularity: ${artist.popularity}`;

    // Search for a song from this artist inside the playlist
    const playlistId = '5ABHKGoOzxkaa28ttQV9sE'; 
    const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const playlistData = await playlistResponse.json();

    // Find a track in the playlist where the artist name matches
    const matchingTrack = playlistData.tracks.items.find(item =>
      item.track.artists.some(a => a.name.toLowerCase().includes(artistName.toLowerCase()))
    );

    // Clear any previous audio or iframe
    detailsDiv.querySelectorAll('audio, iframe').forEach(el => el.remove());

    if (matchingTrack) {
      // Show Spotify's official embedded player for the found track
      const embed = document.createElement('iframe');
      embed.src = `https://open.spotify.com/embed/track/${matchingTrack.track.id}`;
      embed.width = '100%';
      embed.height = '80';
      embed.frameBorder = '0';
      detailsDiv.appendChild(embed);
    } 

    // Show section below artist buttons
    infoSection.classList.remove('hidden');
    setTimeout(() => {
      infoSection.classList.add('visible');
    }, 10); // tiny delay for fade-in animation
  }
});

