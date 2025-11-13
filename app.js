import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import axios from "axios";
import dotenv from "dotenv/config";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// --- Spotify API setup ---
let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken; // reuse existing token
  }

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({ grant_type: "client_credentials" }),
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return accessToken;
}

async function fetchPlaylists(query) {
  const token = await getAccessToken();
  const searchUrl = "https://api.spotify.com/v1/search";
  const response = await axios.get(searchUrl, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: "playlist", limit: 10 },
  });
  return response.data.playlists.items
    .filter((pl) => pl)
    .map((pl) => ({
      name: pl.name,
      description: pl.description,
      owner: pl.owner.display_name,
      spotify_url: pl.external_urls.spotify,
      image: pl.images[0]?.url,
      track_count: pl.tracks.total,
    }));
}

app.get("/city-playlists/:city", async (req, res) => {
  try {
    const playlists = await fetchPlaylists(`${req.params.city} city playlist`);
    res.json({ city: req.params.city, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch city playlists" });
  }
});

app.get("/mood-playlists/:mood", async (req, res) => {
  try {
    const playlists = await fetchPlaylists(`${req.params.mood} mood playlist`);
    res.json({ mood: req.params.mood, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch mood playlists" });
  }
});

app.get("/genre-playlists/:genre", async (req, res) => {
  try {
    const playlists = await fetchPlaylists(
      `${req.params.genre} genre playlist`
    );
    res.json({ genre: req.params.genre, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genre playlists" });
  }
});

app.get("/era-playlists/:era", async (req, res) => {
  try {
    const playlists = await fetchPlaylists(`${req.params.era} era playlist`);
    res.json({ era: req.params.era, count: playlists.length, playlists });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch era playlists" });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
