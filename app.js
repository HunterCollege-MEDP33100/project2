import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import axios from 'axios';
import dotenv from 'dotenv/config';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// --- Spotify API setup ---
let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken; // reuse existing token
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return accessToken;
}

// --- Route: Get top 5 artists from a given city ---
app.get('/top-artists/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const token = await getAccessToken();
    const searchUrl = 'https://api.spotify.com/v1/search';

    const response = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: city,
        type: 'artist',
        limit: 5,
      },
    });

    const artists = response.data.artists.items.map((artist) => ({
      name: artist.name,
      followers: artist.followers.total,
      genres: artist.genres,
      spotify_url: artist.external_urls.spotify,
      image: artist.images[0]?.url,
    }));

    res.json({ city, count: artists.length, artists });
  } catch (error) {
    console.error(
      'Error fetching artists:',
      error.response?.data || error.message
    );
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;
