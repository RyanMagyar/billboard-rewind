const express = require("express");
const { createPlaylistHandler } = require("../controllers/playlistController");

const router = express.Router();

router.post("/createPlaylist", createPlaylistHandler);

module.exports = router;
