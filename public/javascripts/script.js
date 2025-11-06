const PLAYLIST_ID = '37i9dQZEVXbLRQDuF5jeBp'


async function getToken() {
    let token = null
    if (localStorage.getItem('spotifyToken')) {
        token = localStorage.getItem('spotifyToken')
    } else {
        const response = await fetch('/api/spotify/token')
        const data = await response.json()
        token = data.access_token
        localStorage.setItem('spotifyToken'.token)
    }
    return token
}

async function getTopPlaylist() {
    const token = await getToken()
    try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        console.log(data)
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
