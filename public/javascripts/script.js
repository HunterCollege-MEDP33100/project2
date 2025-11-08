console.log('loaded')
const PLAYLIST_ID = '5ABHKGoOzxkaa28ttQV9sE'


async function getToken() {
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
    try {
        const response = await fetch(`
https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()

        if (data.error) {
            localStorage.removeItem('spotifyToken')
            await getTopPlaylist()
        } else {
            return data
        }
    }
    catch (error) {
        console.error(error)
    }
}

async function getData() {
    const playlistData = await getTopPlaylist()
    const artistIDs = getArtistIDs(playlistData.tracks.items)
}

async function getArtistIDs(items) {
    const allArtists = []
    for (let i = 0; i < items.length; i++) {
        const artistData = items[i].track.artists[0]
        allArtists.push(artistData.id)
    }
    console.log(allArtists)
}

getData()
//after loading in tracks data, we need to get all of the artist ids, their popularity, and images of artist. We then want to have sorting options, where we can rank them by popularity and alphabetical order. When you click into an artist, there will be an 'about me' section, and a sample of their most popular song will play (or in this case, whatever of their song is in the playlist)