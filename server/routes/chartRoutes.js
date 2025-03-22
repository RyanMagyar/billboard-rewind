const express = require("express");
const {
  getChartData,
  getArtistData,
} = require("../controllers/chartController");

const router = express.Router();

router.get("/getChart", getChartData);

router.get("/getArtist", getArtistData);

module.exports = router;
