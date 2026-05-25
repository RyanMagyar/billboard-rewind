const { removeUnmatchedBrackets, getNextSaturday } = require("./helpers");
const {
  selectChart,
  selectSong,
  insertSong,
  insertChart,
} = require("./databaseHelper");
const querystring = require("querystring");
require("dotenv").config();

const logger = require("./logger");
const { encryptToken, decryptToken } = require("./tokenCrypto");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const TOKEN_URL = "https://accounts.spotify.com/api/token";

function normalize(str) {
  return str
    ?.toLowerCase()
    .replace(/[^\w\s]/gi, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();
}

function isMatch(resp, track, artist) {
  const resultTrack = normalize(resp?.tracks?.items?.[0]?.name);
  const resultArtist = normalize(resp?.tracks?.items?.[0]?.artists?.[0]?.name);
  const inputTrack = normalize(track);
  const inputArtist = normalize(artist);

  return (
    resultTrack?.includes(inputTrack) && resultArtist?.includes(inputArtist)
  );
}

function isLiveVersion(resp) {
  return resp?.tracks?.items?.[0]?.name?.includes(" - Live");
}

async function fetchWebApi(endpoint, method, token, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let errorMessage;
    try {
      const errData = await res.json();
      errorMessage = errData.error?.message || JSON.stringify(errData);
    } catch {
      errorMessage = res.statusText;
    }
    logger.warn(
      { endpoint, method, status: res.status, errorMessage },
      "Spotify API request failed"
    );
    throw new Error(`Spotify API error ${res.status}: ${errorMessage}`);
  }
  return await res.json();
}

async function createPlaylist(uriArray, playlistName, token) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET", token);

  const charts = {
    Rock: "Rock",
    Rap: "Hip Hop/R&B",
    Hot: "Hot-100",
    Alt: "Alternative",
    Pop: "Pop",
    Country: "Country",
    Latin: "Latin",
  };

  const playlist = await fetchWebApi(
    `v1/users/${user_id}/playlists`,
    "POST",
    token,
    {
      name: playlistName,
      description: "Playlist created by Billboard Rewind",
      public: false,
    }
  );

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${uriArray.join(",")}`,
    "POST",
    token
  );

  return playlist;
}

async function searchTracks(songArray, token, date, genre) {
  let uriArray = [];
  let failedArray = [];

  let chartResult;
  let chartWeek;

  if (genre) {
    chartWeek = getNextSaturday(date);
    logger.info(
      { genre, chartWeek, songCount: songArray.length },
      "Checking chart cache for Spotify data"
    );

    chartResult = await selectChart(genre, chartWeek);

    if (chartResult.rows.length > 0) {
      const chart = chartResult.rows[0];

      // If chart has Spotify data, parse it
      if (chart.spotify_data_filled) {
        logger.info(
          { genre, chartWeek },
          "Chart cache hit with Spotify data"
        );

        let cachedSongs = chart.songs;
        cachedSongs.forEach((song) => {
          if (song.spotifyURI) {
            uriArray.push(song.spotifyURI);
          } else {
            failedArray.push({
              title: song.title,
              artist: song.artist,
              rank: song.rank,
            });
          }
        });

        return { uriArray, failedArray };
      }

      logger.info({ genre, chartWeek }, "Chart cache missing Spotify data");
    } else {
      logger.info({ genre, chartWeek }, "Chart cache miss");
    }
  }

  for (const song of songArray) {
    let { artist, title, rank } = song;
    rank = rank ? rank : song.peak;
    let year = song.debutDate.split("-")[0];
    let track = removeUnmatchedBrackets(title)
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s*\{.*?\}\s*/g, "")
      .trim();

    logger.debug({ title, artist, rank }, "Checking song cache");

    const songResult = await selectSong(title, artist);

    if (songResult.rows.length > 0) {
      logger.debug({ title, artist, rank }, "Song cache hit");
      const dbSong = songResult.rows[0];

      if (dbSong.spotify_uri) {
        uriArray.push(dbSong.spotify_uri);
        song.spotifyURI = dbSong.spotify_uri;
      } else {
        failedArray.push({
          title,
          artist,
          rank,
        });
        song.spotifyURI = "";
      }
    } else {
      logger.debug(
        { title, artist, rank, track, yearRange: `${year - 1}-${Number(year) + 1}` },
        "Fetching song from Spotify"
      );

      let query = `track:${track} artist:${artist} year:${year - 1}-${
        Number(year) + 1
      }`;
      let response = await fetchWebApi(
        `v1/search?q=${encodeURIComponent(
          `track:${track} artist:${artist} year:${year - 1}-${Number(year) + 1}`
        )}&type=track&market=US&limit=1&offset=0`,
        "GET",
        token
      );

      let fallback_response = null;

      // --- fallback logic ---
      if (
        !isMatch(response, track, artist) &&
        response.tracks.items.length &&
        !fallback_response
      ) {
        logger.debug({ title, artist, rank }, "Saving first Spotify fallback");
        fallback_response = JSON.parse(JSON.stringify(response));
        response.tracks.items.length = 0; // clear for next attempt
      }

      // --- second attem ", track, " artist: ", artist);
      if (!response.tracks.items.length) {
        response = await fetchWebApi(
          `v1/search?q=${encodeURIComponent(
            `track:${track} artist:${artist}`
          )}&type=track&market=US&limit=1&offset=0`,
          "GET",
          token
        );

        if (
          !isMatch(response, track, artist) &&
          response.tracks.items.length &&
          !fallback_response
        ) {
          logger.debug(
            { title, artist, rank },
            "Saving second Spotify fallback"
          );
          fallback_response = JSON.parse(JSON.stringify(response));
          response.tracks.items.length = 0;
        }
      }

      // --- try removing slashes ---
      if (!response.tracks.items.length && track.includes("/")) {
        const cleanedTrack = track.split("/")[0];
        response = await fetchWebApi(
          `v1/search?q=${encodeURIComponent(
            `track:${cleanedTrack} artist:${artist}`
          )}&type=track&market=US&limit=1&offset=0`,
          "GET",
          token
        );

        if (
          !isMatch(response, track, artist) &&
          response.tracks.items.length &&
          !fallback_response
        ) {
          fallback_response = JSON.parse(JSON.stringify(response));
          response.tracks.items.length = 0;
        }
      }

      // --- try with split artists ---
      if (
        !response.tracks.items.length &&
        /(And|With| x |Featuring|Starring|Feat.)/i.test(artist)
      ) {
        const splitArtists = artist
          .split(/And|With| x |Featuring|Starring|Feat./i)
          .map((a) => a.trim());

        for (const split of splitArtists) {
          const tempResponse = await fetchWebApi(
            `v1/search?q=${encodeURIComponent(
              `track:${track} artist:${split}`
            )}&type=track&market=US&limit=1&offset=0`,
            "GET",
            token
          );

          if (tempResponse.tracks.items.length) {
            if (!isMatch(tempResponse, track, artist)) {
              if (!fallback_response) {
                logger.debug(
                  { title, artist, rank, splitArtist: split },
                  "Saving split-artist Spotify fallback"
                );
                fallback_response = JSON.parse(JSON.stringify(tempResponse));
              }
            } else {
              response = tempResponse; // First good match — use it and break
              break;
            }
          }
        }
      }

      // --- finally: fallback ---
      if (!response.tracks.items.length && fallback_response) {
        logger.debug({ title, artist, rank }, "Using Spotify fallback match");
        response = fallback_response;
      }

      try {
        const spotifyURI = response.tracks.items[0].uri;
        uriArray.push(spotifyURI);
        song.spotifyURI = spotifyURI;

        await insertSong(title, artist, spotifyURI);
      } catch (error) {
        failedArray.push({ title, artist, rank });
        song.spotifyURI = "";
        logger.warn(
          { err: error, title, artist, rank },
          "Could not match Spotify track"
        );

        await insertSong(title, artist);
      }
      //break;
    }
  }

  if (genre) {
    logger.info(
      { genre, chartWeek, foundCount: uriArray.length, failedCount: failedArray.length },
      "Updating chart cache with Spotify data"
    );

    await insertChart(
      chartResult.rows.length,
      songArray,
      genre,
      chartWeek,
      true
    );
  }

  logger.info(
    { foundCount: uriArray.length, failedCount: failedArray.length },
    "Returning Spotify track search results"
  );
  return { uriArray, failedArray };
}

async function refreshToken(req) {
  try {
    const encryptedRefreshToken = req.session.refresh_token;
    if (!encryptedRefreshToken) {
      logger.warn("Tried refreshing Spotify token without refresh token");
      return 402;
    }

    if (Date.now() > req.session.expires_at) {
      logger.info("Refreshing Spotify token");
      const refresh_token = decryptToken(encryptedRefreshToken);
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        body: querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        logger.warn(
          { status: response.status, spotifyError: json.error },
          "Spotify token refresh failed"
        );
        return 500;
      }

      const access_token = json.access_token;
      const expires_in = json.expires_in;
      const next_refresh_token = json.refresh_token || refresh_token;

      req.session.access_token = encryptToken(access_token);
      req.session.refresh_token = encryptToken(next_refresh_token);
      req.session.expires_at = Date.now() + expires_in * 1000 - 300000;

      logger.info({ expiresIn: expires_in }, "Spotify token refresh succeeded");
      return 200;
    } else {
      logger.debug("Spotify token not expired");
      return 403;
    }
  } catch (error) {
    logger.error({ err: error }, "Error refreshing Spotify token");
    return 500;
  }
}

module.exports = { fetchWebApi, createPlaylist, searchTracks, refreshToken };
