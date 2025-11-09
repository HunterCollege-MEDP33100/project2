const PLAYLIST_ID = '5ABHKGoOzxkaa28ttQV9sE'


async function getToken() {
    console.log('token got')
    let token = null
    if (localStorage.getItem('spotifyToken')) {
        token = localStorage.getItem('spotifyToken')
    } else {
        const response = await fetch('/api/spotify/token')
        const data = await response.json()
        token = data.access_token
        localStorage.setItem('spotifyToken', token)
    }
    return token
}

async function getTopPlaylist() {
    const token = await getToken()
    console.log('playlist got')
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()

        if (data.error) {
            localStorage.removeItem('spotifyToken')
            await getTopPlaylist(await getToken())
        } else {
            return data
        }
    }
    catch (error) {
        console.error(error)
    }
}

async function getArtistIDs(items) {
    const allArtists = new Set()
    for (let i = 0; i < items.length; i++) {
        const artistData = items[i].track.artists[0]
        if (artistData && artistData.id) {
            allArtists.add(artistData.id)
        }
    }

    const artistArray = [...allArtists]
    console.log(allArtists)
    return allArtists
}

async function getArtistPopularity(artistIDs, token) {
    const artists = [];
    for (const id of artistIDs) {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        artists.push({
            name: data.name,
            id: data.id,
            popularity: data.popularity,
            image: data.images?.[0]?.url || null
        });
    }

    console.log(artists);
    return artists;
}

async function getData() {
    const token = await getToken()
    const playlistData = await getTopPlaylist()
    const artistIDs = await getArtistIDs(playlistData.tracks.items)
    const allArtistData = await getArtistPopularity(artistIDs, token)

    const artistPopularityRanked = [...allArtistData].sort((a, b) => b.popularity - a.popularity)
    return artistPopularityRanked
}

async function displayPopularity() {
    const artistPopularityRanked = await getData()
    const div = document.createElement('div')
    div.classList.add('popularity')

    artistPopularityRanked.forEach(artist => {
        const artistDiv = document.createElement('div')
        artistDiv.classList.add('artist')

        const artistName = document.createElement('p')
        artistName.textContent = `${artist.name} - Popularity:${artist.popularity}`

        artistDiv.appendChild(artistName)
        div.appendChild(artistDiv)
    });
    document.body.appendChild(div)
}

displayPopularity()
//after loading in tracks data, we need to get all of the artist ids, their popularity, and images of artist. We then want to have sorting options, where we can rank them by popularity and alphabetical order. When you click into an artist, there will be an 'about me' section, and a sample of their most popular song will play (or in this case, whatever of their song is in the playlist)