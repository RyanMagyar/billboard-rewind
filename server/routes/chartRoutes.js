const express = require("express");
const { getChartData } = require("../controllers/chartController");

const router = express.Router();

router.get("/getChart", getChartData);

module.exports = router;
