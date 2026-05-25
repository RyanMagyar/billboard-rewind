const querystring = require("querystring");
require("dotenv").config();
const logger = require("../utils/logger");

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

exports.login = (req, res) => {
  const state = "ovXzE45nraCUnDjX";
  const scope = "user-read-private user-read-email playlist-modify-private";
  const redirectUri = process.env.SERVER_URL + "/auth/callback";

  logger.info({ redirectUri }, "Starting Spotify login");

  res.redirect(
    AUTH_URL +
      "?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
      })
  );
};

exports.callback = async (req, res) => {
  if (req.query.error) {
    logger.warn({ error: req.query.error }, "Spotify callback returned error");
    return res.json({ error: req.query.error });
  }

  const code = req.query.code;
  if (!code) {
    logger.warn("Spotify callback missing authorization code");
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const redirectUri = process.env.SERVER_URL + "/auth/callback";
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      body: querystring.stringify({
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
    });

    const json = await response.json();
    if (!response.ok) {
      logger.warn(
        { status: response.status, spotifyError: json.error },
        "Spotify token exchange failed"
      );
      return res.redirect(process.env.CLIENT_URL + "/");
    }

    req.session.access_token = json.access_token;
    req.session.refresh_token = json.refresh_token;
    req.session.expires_at = Date.now() + json.expires_in * 1000 - 300000;

    logger.info("Spotify callback completed");
    res.redirect(process.env.CLIENT_URL + "/");
  } catch (error) {
    logger.error({ err: error }, "Error during authentication");
    res.redirect(process.env.CLIENT_URL + "/");
  }
};

exports.checkSession = (req, res) => {
  // Check if the session cookie exists
  const sessionCookie = req.session.access_token;
  if (sessionCookie) {
    res.json({ hasSession: true });
  } else {
    res.json({ hasSession: false });
  }
};
