const express = require("express");
const { getChart } = require("billboard-top-100");
var querystring = require("querystring");
require("dotenv").config();
const moment = require("moment");
var cookieSession = require("cookie-session");
const cors = require("cors");

const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SECRET = process.env.SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1/";

app.set("trust proxy", 1);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, //
  })
);

app.use(
  cookieSession({
    name: "session",
    secret: SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  })
);

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

async function createPlaylist(uriArray, chart, date, token) {
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
      name: "Top " + charts[chart] + " Tracks " + date,
      description: "Playlist created by Billboard rewind",
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

// add refresh token logic
// add failed search retries i.e wokring with '/' e.g Beth/Detroit Rock City, collab artists

async function searchTracks(songArray, token, year) {
  var uriArray = [];
  var failedArray = [];
  //console.log("Songs array length: " + songArray.length);
  for (let i = 0; i < songArray.length; i++) {
    var artist = songArray[i].artist;
    var track = songArray[i].title.replace(/\s*\(.*?\)\s*/g, "").trim();
    var rank = songArray[i].rank;

    //console.log("Searching: " + track);
    var response = await fetchWebApi(
      `v1/search?q=track:${track} artist:${artist} year:${year - 1}-${
        Number(year) + 1
      }&type=track&market=US&limit=1&offset=0`,
      "GET",
      token
    );

    //items array exists but is empty
    // try searching without the year
    if (response.tracks.items && !response.tracks.items.length) {
      response = await fetchWebApi(
        `v1/search?q=track:${track} artist:${artist}&type=track&market=US&limit=1&offset=0`,
        "GET",
        token
      );
    }

    // Track name has "/" in try searching the first part
    if (
      response.tracks.items &&
      !response.tracks.items.length &&
      track.includes("/")
    ) {
      const splitTrack = track.split("/");
      response = await fetchWebApi(
        `v1/search?q=track:${splitTrack[0]} artist:${artist}&type=track&market=US&limit=1&offset=0`,
        "GET",
        token
      );
    }

    // if artist has "and" in it try searching each artist
    if (
      (response.tracks.items &&
        !response.tracks.items.length &&
        artist.includes("And")) ||
      artist.includes("With") ||
      artist.includes(" x ") ||
      artist.includes("Starring")
    ) {
      var splitArtist;
      if (artist.includes("And")) {
        splitArtist = artist.split(" And ");
      } else if (artist.includes("With")) {
        splitArtist = artist.split(" With ");
      } else if (artist.includes(" x ")) {
        splitArtist = artist.split(" x ");
      } else if (artist.includes(" Starring ")) {
        splitArtist = artist.split(" Starring ");
      }
      response = await fetchWebApi(
        `v1/search?q=track:${track} artist:${splitArtist[0]}&type=track&market=US&limit=1&offset=0`,
        "GET",
        token
      );

      if (response.tracks.items && !response.tracks.items.length) {
        response = await fetchWebApi(
          `v1/search?q=track:${track} artist:${splitArtist[1]}&type=track&market=US&limit=1&offset=0`,
          "GET",
          token
        );
      }
    }

    // artist has "Featuring" try removing
    if (
      response.tracks.items &&
      !response.tracks.items.length &&
      artist.includes("Featuring")
    ) {
      const splitArtist = artist.split("Featuring");
      response = await fetchWebApi(
        `v1/search?q=track:${track} artist:${splitArtist[0]}&type=track&market=US&limit=1&offset=0`,
        "GET",
        token
      );

      if (response.tracks.items && !response.tracks.items.length) {
        response = await fetchWebApi(
          `v1/search?q=track:${track} artist:${splitArtist[1]}&type=track&market=US&limit=1&offset=0`,
          "GET",
          token
        );
      }
    }

    try {
      uriArray.push(response.tracks.items[0].uri);
    } catch (error) {
      failedArray.push({ track: track, artist: artist, rank: rank });
      //console.log(response);
      console.log(
        "Couldn't add track: " + track + " artist: " + artist + " rank: " + rank
      );
    }
  }

  return {
    uriArray: uriArray,
    failedArray: failedArray,
  };
}

app.get("/debug", (req, res) => {
  req.session.access_token = ACCESS_TOKEN;
  req.session.refresh_token = REFRESH_TOKEN;
  req.session.expires_at = Date.now() + 10 * 1000;
  console.log(req.session);
  res.json(req.session);
});

app.get("/token", (req, res) => {
  const token = req.session.access_token;
  if (token) {
    res.json({ access_token: token });
  } else {
    res.status(401).json({ message: "no access token found" });
  }
});

app.get("/login", (req, res) => {
  var state = "ovXzE45nraCUnDjX";
  var scope = "user-read-private user-read-email playlist-modify-private";

  res.redirect(
    AUTH_URL +
      "?" +
      querystring.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
});

async function refreshToken(req) {
  try {
    const refresh_token = req.session.refresh_token;
    console.log(refresh_token);
    if (!refresh_token) {
      console.log("Tried refreshing token without refresh token");
      return 402;
      res.redirect("/login");
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
      req.session.expires_at = Date.now() + expires_in * 1000;

      return 200;
    } else {
      console.log("Token not expired yet");
      return 403;
      res.status(403).json({ message: "Token not expired yet" });
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return 500;
    res.status(500).send("Internal Server Error");
  }
}

/*
app.get("/refreshToken", async (req, res) => {
  try {
    const refresh_token = req.session.refresh_token;
    console.log(refresh_token);
    if (!refresh_token) {
      console.log("Tried refreshing token without refresh token");
      res.redirect("/login");
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
      console.log(json);
      console.log(access_token);
      console.log(refresh_token);
      console.log(expires_in);

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.expires_at = Date.now() + expires_in * 1000;

      res.redirect("/createPlaylist");
    } else {
      console.log("Token not expired yet");
      res.status(403).json({ message: "Token not expired yet" });
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).send("Internal Server Error");
  }
});
*/

app.get("/getChart", async (req, res) => {
  //var chartName = "hot-mainstream-rock-tracks";
  //var date = "1997-10-16";
  const genres = {
    Rock: "hot-mainstream-rock-tracks",
    Rap: "r-b-hip-hop-songs",
    Hot: "hot-100",
    Alt: "alternative-airplay",
    Pop: "adult-contemporary",
    Country: "country-songs",
    Latin: "latin-songs",
  };

  var chartName = req.query.chart;
  var date = req.query.date;

  if (!chartName || !date) {
    return res.status(400).send({
      message: "Missing query params!",
    });
  }

  if (!(chartName in genres)) {
    return res.status(400).send({
      message: "Improper chart name.",
    });
  }

  const chartUrl = genres[chartName];

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send({
      message: "Improper date format.",
    });
  }

  console.log(chartUrl);
  console.log(date);

  var songs;

  getChart(chartUrl, date, (err, chart) => {
    if (err) {
      //console.log(err);
      return res.status(400).send({
        message: "Error!",
      });
    }
    songs = chart.songs;
    console.log(chart.songs);
    console.log("Week of " + chart.week);
    res.json(songs);
  });
});

app.post("/createPlaylist", async (req, res) => {
  if (!req.session.access_token) {
    console.log("/createPlaylist with no access token");
    return res.status(402).send("Error No Access Token");
  }

  if (Date.now() > req.session.expires_at) {
    console.log("/createPLaylist refreshing token");
    const tokenRes = await refreshToken(req);
    if (tokenRes === 402) {
      return res.status(402).send("Token Refresh Error");
    } else if (tokenRes === 500) {
      return res.status(500).send("Internal Server Error");
    }
    //res.redirect("/refreshToken");
  }

  console.log("RESPONSE");

  const chart = req.query.chart;
  const date = req.query.date;
  const songArray = req.body;
  const token = req.session.access_token;
  const dateArray = date.split("-");
  const year = dateArray[2];
  //console.log(songArray);

  console.log("Searching Songs");
  console.log("Chart: " + chart);
  console.log("Date: " + date);
  //console.log("Body: " + JSON.stringify(req.body, null, 2));
  const songsObj = await searchTracks(songArray, token, year);
  console.log("Returned from searchTracks");
  const uriArray = songsObj.uriArray;
  const failedArray = songsObj.failedArray;

  const createdPlaylist = await createPlaylist(uriArray, chart, date, token);

  return res.json({ playlist: createdPlaylist, failedArray: failedArray });
});

app.get("/callback", async (req, res) => {
  console.log("Running callback");
  if (req.query.error) {
    console.log("ERROR in req");
    return JSON.stringify({ error: req.query.error });
  }

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    try {
      console.log("fetching");
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        body: querystring.stringify({
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
      });
      console.log("success");
      const json = await response.json();
      const access_token = json.access_token;
      const refresh_token = json.refresh_token;
      const expires_in = json.expires_in;

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.expires_at = Date.now() + expires_in * 1000;

      console.log("success");
      console.log(json);
      console.log(access_token);
      console.log(refresh_token);
      console.log(expires_in);
      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error(error.message);
      res.redirect("http://localhost:5173/");
    }
  }
});

app.get("/", (req, res) => {
  res.send("Hello <a href='login'>Login with Spotify</a>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
