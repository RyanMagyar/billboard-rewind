const express = require("express");
var querystring = require("querystring");
require("dotenv").config();

const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/callback";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1/";

app.get("/login", (req, res) => {
  var state = "ovXzE45nraCUnDjX";
  var scope = "user-read-private user-read-email";

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
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        body: JSON.stringify({
          code: code,
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
});

app.get("/", (req, res) => {
  res.send("Hello <a href='login'>Login with Spotify</a>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
