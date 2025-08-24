const { fetchWebApi, refreshToken } = require("../utils/spotifyApi");

const searchArtist = async (req, res) => {
  if (!req.session.access_token) {
    console.log("/searchArtist with no access token");
    return res.status(402).send("Error No Access Token");
  }

  if (Date.now() > req.session.expires_at) {
    console.log("/searchArtist refreshing token");
    const tokenRes = await refreshToken(req);
    if (tokenRes === 402) {
      return res.status(402).send("Token Refresh Error");
    } else if (tokenRes === 500) {
      return res.status(500).send("Internal Server Error");
    }
  }
  const token = req.session.access_token;
  const query = req.query.q;
  console.log("searching for query: ", query);
  fetchWebApi(
    `v1/search?q=${query.split(" ").join("%20")}&type=artist&limit=5`,
    "GET",
    token
  )
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(error.message);
    });
};

module.exports = { searchArtist };
