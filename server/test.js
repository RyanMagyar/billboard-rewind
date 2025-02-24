const { getChart } = require("billboard-top-100");
const { listCharts } = require("billboard-top-100");

const rock = "hot-mainstream-rock-tracks"; //3-21-1981
const rap = "r-b-hip-hop-songs"; // 10-20-1958
const hot = "hot-100"; // 8-4-1958
const alt = "alternative-airplay"; // 9-10-1988
const pop = "adult-contemporary"; // 7-17-1961
const country = "country-songs"; // 10-20-1958
const latin = "latin-songs"; //9-20-1986

const genres = {
  rock: "hot-mainstream-rock-tracks",
  rap: "r-b-hip-hop-songs",
  hot: "hot-100",
  alt: "alternative-airplay",
  pop: "adult-contemporary",
  country: "country-songs",
  latin: "latin-songs",
};

getChart(genres["pop"], "1970-10-16", (err, chart) => {
  if (err) console.log(err);
  console.log(genres["rock"]);
  console.log(chart);
});

listCharts((err, charts) => {
  if (err) console.log(err);
  // array of all charts
  //console.log(charts);
  /*charts.forEach((chart) => {
    if (chart.name.includes("Hip")) {
      console.log(chart);
    }
  });*/
});
