const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const { getArtist } = require("./utils/billboard-api/getArtist");
const logger = require("./utils/logger");

const BILLBOARD_BASE_URL = "http://www.billboard.com";
const BILLBOARD_ARTIST_URL = `${BILLBOARD_BASE_URL}/artist/`;

function convertDate(date) {
  const parsedDate = moment(date, "MM.DD.YY");

  const year = parsedDate.year();

  if (year >= 2026 && year <= 2099) {
    parsedDate.year(year - 100);
  }

  return parsedDate.format("YYYY-MM-DD");
}

async function getMyArtist(name, callback) {
  try {
    let artist = name.replace(/ /g, "-");

    const requestURL = `${BILLBOARD_ARTIST_URL}${artist}/chart-history/hsi/`;
    logger.info({ artist, requestURL }, "Fetching Billboard artist test data");

    const response = await axios.get(requestURL);
    const html = response.data;

    const $ = cheerio.load(html);

    const chartHeadings = $(".lrv-a-grid");

    const chart = {};

    chart.songs = [];

    chart.artist = $(".c-heading").first().text().trim();

    chart.url = requestURL;

    if ($(chartHeadings[1]).find(".artist-stat-1").length > 0) {
      // No.1 Hits
      chart.numOnes = parseInt(
        $(chartHeadings[1]).find(".artist-stat-1").text().trim(),
        10
      );
      // Top 10 Hits
      chart.topTens = $(chartHeadings[1]).find(".artist-stat-2").text().trim();
      // Songs
      chart.numSongs = $(chartHeadings[1]).find(".artist-stat-3").text().trim();

      // Get all songs in list
      const chartItems = $(".o-chart-results-list-row ");

      chartItems.each((index, element) => {
        const song = {};
        // Get song title
        song.title = $(element).find(".c-title").text().trim();
        // Get Artist
        song.artist = $(element).find(".c-label").eq(0).text().trim();

        // Get Debut
        song.debutDate = convertDate(
          $(element).find(".c-label").eq(1).text().trim(),
          "MM.DD.YY"
        );

        // Peak
        song.peak = $(element).find(".c-label").eq(2).text().trim();

        // Peak Date
        song.peakDate = convertDate(
          $(element).find(".c-label").eq(4).text().trim(),
          "MM.DD.YY"
        );

        // Weeks On
        song.weeksOn = $(element).find(".c-label").eq(5).text().trim();

        chart.songs.push(song);
      });
    }

    chart.songs.sort((a, b) => a.peak - b.peak);

    if (chart.numSongs > 100) {
      chart.songs = chart.songs.slice(0, 100);
    }

    if ($(chartHeadings[1]).find(".artist-stat-1").length > 0) {
      callback(null, chart);
    } else {
      callback("Songs not found", null);
    }
  } catch (error) {
    logger.error({ err: error }, "Error fetching artist test data");
    callback(error, null);
    return;
  }
}

async function main() {
  await getArtist("Paul Mccartney", async (error, chart) => {
    if (error) {
      logger.error({ err: error }, "Error retrieving artist");
      return;
    }
    logger.info(
      { artist: chart.artist, songCount: chart.songs.length, chart },
      "Retrieved artist"
    );
  });
}

main().then(
  () => process.exit(0),
  (e) => {
    logger.error({ err: e }, "Artist test script failed");
    process.exit(1);
  }
);
