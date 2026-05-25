const moment = require("moment");
const {
  fetchWebApi,
  searchTracks,
  createPlaylist,
  refreshToken,
} = require("../utils/spotifyApi");
const logger = require("../utils/logger");
const { decryptToken } = require("../utils/tokenCrypto");

async function createPlaylistHandler(req, res) {
  if (!req.session.access_token) {
    logger.warn("Playlist creation attempted without access token");
    return res.status(402).send("Error No Access Token");
  }

  if (Date.now() > req.session.expires_at) {
    logger.info("Refreshing Spotify token before playlist creation");
    const tokenRes = await refreshToken(req);
    if (tokenRes === 402) {
      return res.status(402).send("Token Refresh Error");
    } else if (tokenRes === 500) {
      return res.status(500).send("Internal Server Error");
    }
  }

  const { chart, date, artist } = req.query;

  const hasChartAndDate = chart && date;
  const hasArtist = artist;

  if (!(hasChartAndDate || hasArtist)) {
    return res.status(400).json({
      error: "Invalid parameters. Provide either (chart and date) or artist.",
    });
  }

  if (hasChartAndDate && hasArtist) {
    return res.status(400).json({
      error: "Cannot provide both chart/date and artist. Choose one method.",
    });
  }

  let songArray = [];

  if (hasChartAndDate) {
    if (!moment(date, "MM-DD-YYYY", true).isValid()) {
      return res.status(400).send({
        message: "Improper date format.",
      });
    }
    let songDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD");
    songArray = req.body.map((item) => ({
      ...item,
      debutDate: songDate,
    }));
  } else {
    songArray = req.body.songs;
  }

  logger.info(
    { chart, date, artist, songCount: songArray.length },
    "Processing playlist creation"
  );
  //const songArray = req.body;
  const token = decryptToken(req.session.access_token);

  const myDate = moment(date, "MM-DD-YYYY").format("YYYY-MM-DD");

  const songsObj = await searchTracks(songArray, token, myDate, chart);
  const uriArray = songsObj.uriArray;
  const failedArray = songsObj.failedArray;
  logger.info(
    { foundCount: uriArray.length, failedCount: failedArray.length },
    "Spotify track search completed"
  );

  let playlistName;
  if (artist) {
    playlistName = `Top Tracks from ${artist}`;
  } else {
    const charts = {
      Rock: "Rock",
      Rap: "Hip Hop/R&B",
      Hot: "Hot-100",
      Alt: "Alternative",
      Pop: "Pop",
      Country: "Country",
      Latin: "Latin",
    };
    playlistName = `Top ${charts[chart]} Tracks ${date}`;
  }
  const createdPlaylist = await createPlaylist(uriArray, playlistName, token);
  logger.info(
    { playlistId: createdPlaylist.id, playlistName },
    "Spotify playlist created"
  );

  return res.json({ playlist: createdPlaylist, failedArray: failedArray });
}

module.exports = { createPlaylistHandler };
