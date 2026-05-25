const { fetchWebApi, refreshToken } = require("../utils/spotifyApi");
const logger = require("../utils/logger");

const searchArtist = async (req, res) => {
  if (!req.session.access_token) {
    logger.warn("Artist search attempted without access token");
    return res.status(402).send("Error No Access Token");
  }

  if (Date.now() > req.session.expires_at) {
    logger.info("Refreshing Spotify token before artist search");
    const tokenRes = await refreshToken(req);
    if (tokenRes === 402) {
      return res.status(402).send("Token Refresh Error");
    } else if (tokenRes === 500) {
      return res.status(500).send("Internal Server Error");
    }
  }
  const token = req.session.access_token;
  const query = req.query.q;
  logger.info({ query }, "Searching Spotify artists");
  fetchWebApi(
    `v1/search?q=${query.split(" ").join("%20")}&type=artist&limit=5`,
    "GET",
    token
  )
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      logger.warn({ err: error, query }, "Spotify artist search failed");
      return res.status(500).send(error.message);
    });
};

module.exports = { searchArtist };
