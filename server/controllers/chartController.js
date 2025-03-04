const { getChart } = require("billboard-top-100");
const moment = require("moment");

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

  getChart(genres[chartName], date, (err, chart) => {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: "Error retrieving chart data." });
    }

    // Ensure songs have correct ranks
    chart.songs.forEach((song, index) => (song.rank = index + 1));

    console.log(`Week of ${chart.week}`);
    res.json(chart.songs);
  });
};

module.exports = { getChartData };
