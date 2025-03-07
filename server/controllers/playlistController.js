const moment = require("moment");
const {
  fetchWebApi,
  searchTracks,
  createPlaylist,
  refreshToken,
} = require("../utils/spotifyApi");

async function createPlaylistHandler(req, res) {
  if (!req.session.access_token) {
    console.log("/createPlaylist with no access token");
    return res.status(402).send("Error No Access Token");
  }

  const chart = req.query.chart;
  const date = req.query.date;

  if (!chart || !date) {
    return res.status(400).send({
      message: "Missing query params!",
    });
  }

  if (!moment(date, "MM-DD-YYYY", true).isValid()) {
    return res.status(400).send({
      message: "Improper date format.",
    });
  }

  if (Date.now() > req.session.expires_at) {
    console.log("/createPlaylist refreshing token");
    const tokenRes = await refreshToken(req);
    if (tokenRes === 402) {
      return res.status(402).send("Token Refresh Error");
    } else if (tokenRes === 500) {
      return res.status(500).send("Internal Server Error");
    }
  }

  console.log("Processing Playlist Creation...");

  const songArray = req.body;
  const token = req.session.access_token;

  const myDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD");

  const songsObj = await searchTracks(songArray, token, myDate, chart);
  const uriArray = songsObj.uriArray;
  const failedArray = songsObj.failedArray;

  const createdPlaylist = await createPlaylist(uriArray, chart, date, token);

  return res.json({ playlist: createdPlaylist, failedArray: failedArray });
}

module.exports = { createPlaylistHandler };
