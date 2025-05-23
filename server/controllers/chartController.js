const { getChart } = require("billboard-top-100");
const { getArtist } = require("../utils/getArtist");
const { getNextSaturday } = require("../utils/helpers");
const { selectChart, insertChart } = require("../utils/databaseHelper");
const moment = require("moment");
const db = require("../db");

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

  console.log(`Checking cache for chart: ${chartName} on ${chartWeek}`);

  const chartResult = await selectChart(chartName, chartWeek);

  if (chartResult.rows.length > 0) {
    const chart = chartResult.rows[0];
    console.log("Cache hit for chart");
    return res.json(chart.songs);
  } else {
    console.log("Chart not found in cache.");
  }

  getChart(genres[chartName], date, async (err, chart) => {
    if (err) {
      console.log(err);
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

    console.log("Input date: " + date);
    console.log("Next Sat: " + getNextSaturday(date));
    console.log(`Week of ${chart.week}`);
    //console.log(JSON.stringify(chart, null, 2));

    console.log("Updating DB chart.");
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

  console.log("Getting Artist data for: " + artistName);

  getArtist(artistName, async (error, chart) => {
    if (error) {
      console.log(error + " error fetching artist data");
      return res.status(400).send({ message: "Error retrieving chart data." });
    }

    console.log("Chart data received.");
    res.json(chart);
    return;
  });
};

module.exports = { getChartData, getArtistData };
