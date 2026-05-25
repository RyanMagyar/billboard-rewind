const { getChart } = require("../utils/billboard-api/getChart");
const { getArtist } = require("../utils/billboard-api/getArtist");
const { getNextSaturday } = require("../utils/helpers");
const { selectChart, insertChart } = require("../utils/databaseHelper");
const moment = require("moment");
const db = require("../db");
const logger = require("../utils/logger");

const genres = {
  Rock: "hot-mainstream-rock-tracks",
  Rap: "r-b-hip-hop-songs",
  Hot: "hot-100",
  Alt: "alternative-airplay",
  Pop: "adult-contemporary",
  Country: "country-songs",
  Latin: "latin-songs",
};

const getChartData = async (req, res) => {
  const chartName = req.query.chart;
  const date = req.query.date;

  if (!chartName || !date) {
    return res.status(400).send({ message: "Missing query params!" });
  }

  if (!(chartName in genres)) {
    return res.status(400).send({ message: "Improper chart name." });
  }

  if (!moment(date, "YYYY-MM-DD", true).isValid()) {
    return res.status(400).send({ message: "Improper date format." });
  }

  const chartWeek = getNextSaturday(date);

  logger.info({ chartName, chartWeek }, "Checking chart cache");

  const chartResult = await selectChart(chartName, chartWeek);

  if (chartResult.rows.length > 0) {
    const chart = chartResult.rows[0];
    logger.info({ chartName, chartWeek }, "Chart cache hit");
    return res.json(chart.songs);
  } else {
    logger.info({ chartName, chartWeek }, "Chart cache miss");
  }

  getChart(genres[chartName], date, async (err, chart) => {
    if (err) {
      logger.warn({ err, chartName, date }, "Error retrieving chart data");
      return res.status(400).send({ message: "Error retrieving chart data." });
    }

    // Ensure songs have correct ranks
    chart.songs.forEach((song, index) => {
      song.rank = index + 1;
      // Make capitalization standard
      song.title = song.title
        .toLowerCase()
        .replace(/(?:^|\s|\()\w/g, (char) => char.toUpperCase());
    });

    logger.info(
      { chartName, date, chartWeek, billboardWeek: chart.week },
      "Retrieved chart data"
    );
    logger.info({ chartName, chartWeek }, "Inserting chart cache entry");
    await insertChart(
      chartResult.rows.length,
      chart.songs,
      chartName,
      chartWeek,
      false
    );

    res.json(chart.songs);
  });
};

const getArtistData = async (req, res) => {
  const artistName = req.query.name;

  if (!artistName) {
    return res.status(400).send({ message: "Missing query params!" });
  }

  logger.info({ artistName }, "Getting artist data");

  getArtist(artistName, async (error, chart) => {
    if (error) {
      logger.warn({ err: error, artistName }, "Error fetching artist data");
      return res.status(400).send({ message: "Error retrieving artist data." });
    }

    logger.info({ artistName }, "Artist chart data received");
    res.json(chart);
    return;
  });
};

module.exports = { getChartData, getArtistData };
