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
            await getTopPlaylist(token)
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

async function getArtistData(artistIDs, token) {
    const artists = [];
    for (const id of artistIDs) {
        const response = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        artists.push({
            name: data.name,
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
    const allArtistData = await getArtistData(artistIDs, token)

    //sorts the artists from most to least popular
    const artistPopularityRanked = [...allArtistData].sort((a, b) => b.popularity - a.popularity)
    return artistPopularityRanked
}

async function displayPopularity() {
    document.getElementById('title').style.display = 'none'
    const loading = document.getElementById('loading')

    const artistPopularityRanked = await getData()

    //after data retrieved, hide "loading artists..." and show title
    document.getElementById('title').style.display = 'block'
    loading.style.display = 'none'

    //create a div with the class popularity
    const div = document.createElement('div')
    div.classList.add('popularity')

    //for each artistID retrieved from data, create an individual div for it with the class 'artist', and creates a button with the text content being their name.
    artistPopularityRanked.forEach(artist => {
        const artistDiv = document.createElement('div')
        artistDiv.classList.add('artist')

        const artistName = document.createElement('button')
        artistName.classList.add('artist-button')
        artistName.textContent = `${artist.name}`

        artistDiv.appendChild(artistName)
        div.appendChild(artistDiv)
    });
    //puts 'popularity' div onto HTML page
    document.body.appendChild(div)
}

displayPopularity()
