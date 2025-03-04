const querystring = require("querystring");
require("dotenv").config();

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

exports.login = (req, res) => {
  const state = "ovXzE45nraCUnDjX";
  const scope = "user-read-private user-read-email playlist-modify-private";

  res.redirect(
    AUTH_URL +
      "?" +
      querystring.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SERVER_URL + "/auth/callback",
        state: state,
      })
  );
};

exports.callback = async (req, res) => {
  if (req.query.error) {
    return res.json({ error: req.query.error });
  }

  const code = req.query.code;
  if (!code)
    return res.status(400).json({ error: "Missing authorization code" });

  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      body: querystring.stringify({
        code: code,
        redirect_uri: process.env.SERVER_URL + "/auth/callback",
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
    req.session.access_token = json.access_token;
    req.session.refresh_token = json.refresh_token;
    req.session.expires_at = Date.now() + json.expires_in * 1000 - 300000;

    res.redirect(process.env.CLIENT_URL + "/");
  } catch (error) {
    console.error("Error during authentication:", error);
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
