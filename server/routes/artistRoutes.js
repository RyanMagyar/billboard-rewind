const express = require("express");
const { searchArtist } = require("../controllers/artistController");

const router = express.Router();

router.get("/searchArtist", searchArtist);

module.exports = router;
