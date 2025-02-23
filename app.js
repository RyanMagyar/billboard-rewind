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

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1/";

app.set("trust proxy", 1);

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

app.get("/debug", (req, res) => {
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

app.get("/getChart", async (req, res) => {
  //var chartName = "hot-mainstream-rock-tracks";
  //var date = "1997-10-16";

  var chartName = req.query.chart;
  var date = req.query.date;

  if (!chartName || !date) {
    return res.status(400).send({
      message: "Missing query params!",
    });
  }

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send({
      message: "Improper date format.",
    });
  }

  console.log(chartName);
  console.log(date);

  var songs;

  getChart(chartName, date, (err, chart) => {
    if (err) {
      //console.log(err);
      return res.status(400).send({
        message: "Error!",
      });
    }
    songs = chart.songs;
    console.log(chart.songs);
    res.json(songs);
  });

  console.log(songs);
});

app.get("/callback", async (req, res) => {
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
      req.expires_at = Date.now() + expires_in * 1000;

      console.log("success");
      console.log(json);
      console.log(access_token);
      console.log(refresh_token);
      console.log(expires_in);
      res.redirect("/");
    } catch (error) {
      console.error(error.message);
      res.redirect("/");
    }
  }
});

app.get("/", (req, res) => {
  res.send("Hello <a href='login'>Login with Spotify</a>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
