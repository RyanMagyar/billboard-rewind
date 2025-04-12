const { removeUnmatchedBrackets, getNextSaturday } = require("./helpers");
const {
  selectChart,
  selectSong,
  insertSong,
  insertChart,
} = require("./databaseHelper");
const querystring = require("querystring");
require("dotenv").config();

const db = require("../db");
const { isTemplateMiddleOrTemplateTail } = require("typescript");
const e = require("express");

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
    body: JSON.stringify(body),
  });
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
    const chartWeek = getNextSaturday(date);
    console.log(`Songs array length: ${songArray.length}`);
    console.log(`Checking cache for chart: ${genre} on ${chartWeek}`);

    chartResult = await selectChart(genre, chartWeek);

    if (chartResult.rows.length > 0) {
      const chart = chartResult.rows[0];

      // If chart has Spotify data, parse it
      if (chart.spotify_data_filled) {
        console.log("Chart found in cache with Spotify data.");

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

      console.log("Chart found in cache but missing Spotify data.");
    } else {
      console.log("Chart not found in cache.");
    }
  }

  for (const song of songArray) {
    let { artist, title, rank } = song;
    rank = rank ? rank : song.peak;
    console.log(song);
    let year = song.debutDate.split("-")[0];
    let track = removeUnmatchedBrackets(title)
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s*\{.*?\}\s*/g, "")
      .trim();

    console.log(`Checking song cache: ${title} by ${artist}`);

    const songResult = await selectSong(title, artist);

    if (songResult.rows.length > 0) {
      console.log("CACHE HIT");
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
      console.log(`Fetching song from Spotify: ${track}`);

      console.log(`Year: year:${year - 1}-${Number(year) + 1}`);

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
        console.log("Setting fallback from first query...");
        fallback_response = JSON.parse(JSON.stringify(response));
        response.tracks.items.length = 0; // clear for next attempt
      }

      // --- second attempt ---
      if (!response.tracks.items.length) {
        response = await fetchWebApi(
          `v1/search?q=track:${track} artist:${artist}&type=track&market=US&limit=1&offset=0`,
          "GET",
          token
        );

        if (
          !isMatch(response, track, artist) &&
          response.tracks.items.length &&
          !fallback_response
        ) {
          console.log("Setting fallback from second query...");
          fallback_response = JSON.parse(JSON.stringify(response));
          response.tracks.items.length = 0;
        }
      }

      // --- try removing slashes ---
      if (!response.tracks.items.length && track.includes("/")) {
        const cleanedTrack = track.split("/")[0];
        response = await fetchWebApi(
          `v1/search?q=track:${cleanedTrack} artist:${artist}&type=track&market=US&limit=1&offset=0`,
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
        /(And|With| x |Featuring|Starring)/i.test(artist)
      ) {
        const splitArtists = artist
          .split(/And|With| x |Featuring|Starring/i)
          .map((a) => a.trim());

        for (const split of splitArtists) {
          const tempResponse = await fetchWebApi(
            `v1/search?q=track:${track} artist:${split}&type=track&market=US&limit=1&offset=0`,
            "GET",
            token
          );

          if (tempResponse.tracks.items.length) {
            if (!isMatch(tempResponse, track, artist)) {
              if (!fallback_response) {
                console.log("Setting fallback from split artist...");
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
        console.log("No perfect match found. Using fallback...");
        response = fallback_response;
      }

      try {
        //console.log(response.tracks.items[0]);
        const spotifyURI = response.tracks.items[0].uri;
        //console.log(spotifyURI);
        uriArray.push(spotifyURI);
        song.spotifyURI = spotifyURI;

        await insertSong(title, artist, spotifyURI);
      } catch (error) {
        console.log(error);
        failedArray.push({ title, artist, rank });
        song.spotifyURI = "";
        console.log(
          `Couldn't add track: ${title} | Artist: ${artist} | Rank: ${rank}`
        );

        await insertSong(title, artist);
      }
      //break;
    }
  }

  if (genre) {
    console.log("Updating DB chart with Spotify data.");

    await insertChart(
      chartResult.rows.length,
      songArray,
      genre,
      chartWeek,
      true
    );
  }

  //console.log(JSON.stringify(songArray, null, 2));
  console.log("Returning from searchTracks");
  return { uriArray, failedArray };
}

async function refreshToken(req) {
  try {
    const refresh_token = req.session.refresh_token;
    console.log(refresh_token);
    if (!refresh_token) {
      console.log("Tried refreshing token without refresh token");
      return 402;
    }

    if (Date.now() > req.session.expires_at) {
      console.log("Refreshing Token");
      console.log(refresh_token);
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
      console.log("refresh success");
      const json = await response.json();
      const access_token = json.access_token;
      const expires_in = json.expires_in;
      //console.log(json);
      console.log(access_token);
      console.log(refresh_token);
      console.log(expires_in);

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.expires_at = Date.now() + expires_in * 1000 - 300000;

      return 200;
    } else {
      console.log("Token not expired yet");
      return 403;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return 500;
  }
}

module.exports = { fetchWebApi, createPlaylist, searchTracks, refreshToken };
