const axios = require("axios");
const cheerio = require("cheerio");

const BILLBOARD_BASE_URL = "http://www.billboard.com";
const BILLBOARD_ARTIST_URL = `${BILLBOARD_BASE_URL}/artist/`;

async function getArtist(name, cb) {
  try {
    let artist = name.replace(/ /g, "-");
    console.log("Artist: " + artist);

    const requestURL = `${BILLBOARD_ARTIST_URL}${artist}/chart-history/hsi/`;
    console.log("Request Url: " + requestURL);

    const response = await axios.get(requestURL);
    const html = response.data;

    const $ = cheerio.load(html);

    const chartHeadings = $(".lrv-a-grid");

    const chart = {};

    chart.artist = $(".c-heading").first().text().trim();

    if ($(chartHeadings[1]).find(".artist-stat-1").length > 0) {
      // No.1 Hits
      chart.numOnes = $(chartHeadings[1]).find(".artist-stat-1").text().trim();
      console.log("No.1 Hits: " + chart.numOnes);

      // Top 10 Hits
      chart.topTens = $(chartHeadings[1]).find(".artist-stat-2").text().trim();
      console.log("Top 10 Hits: " + chart.topTens);
      // Songs
      chart.numSongs = $(chartHeadings[1]).find(".artist-stat-3").text().trim();
      console.log("Songs: " + chart.numSongs);
      // Artist Name
      console.log("Artist: " + chart.artist);
    } else {
      console.log(chart.artist + " has no songs to display");
    }

    if (cb) cb(null, chartHeadings);
    return chartHeadings;
  } catch (error) {
    console.log(error);
    if (cb) cb(error, null);
  }
}

async function main() {
  await getArtist("Tom Petty and the heartbreakers");
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);
