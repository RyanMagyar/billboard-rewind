const express = require("express");
const { createPlaylistHandler } = require("../controllers/playlistController");
const { playlistCreateLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/createPlaylist", playlistCreateLimiter, createPlaylistHandler);

module.exports = router;
