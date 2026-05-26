const express = require("express");
const { searchArtist } = require("../controllers/artistController");
const { artistSearchLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.get("/searchArtist", artistSearchLimiter, searchArtist);

module.exports = router;
