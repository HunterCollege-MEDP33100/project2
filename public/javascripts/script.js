console.log('loaded')
const PLAYLIST_ID = '37i9dQZEVXbLRQDuF5jeBp'


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
        const response = await fetch(`/api/spotify/playlist/${PLAYLIST_ID}`, {
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

//after loading in tracks data, we need to get the top 10 artist ids, their popularity, and images of artist. it'll show the ranking of the top 10, and when you click into an artist, there will be an 'about me' section, and a sample of their most popular song will play(?)