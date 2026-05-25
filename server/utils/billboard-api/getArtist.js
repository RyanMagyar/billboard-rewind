const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");
const logger = require("../logger");

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

async function getArtist(name, callback) {
  try {
    let artist = name.replace(/[ /]/g, "-");

    const requestURL = `${BILLBOARD_ARTIST_URL}${artist}/chart-history/hsi/`;
    logger.info({ artist, requestURL }, "Fetching Billboard artist data");

    const response = await axios.get(requestURL);
    const html = response.data;

    const $ = cheerio.load(html);

    const chart = {};
    chart.songs = [];
    chart.artist = $(".c-heading").first().text().trim();
    chart.url = requestURL;

    const chartHeadings = $(".lrv-a-grid");
    if (chartHeadings.length > 1) {
      chart.numOnes = parseInt(
        $(chartHeadings[1]).find(".artist-stat-1").text().trim(),
        10
      );
      chart.topTens = parseInt(
        $(chartHeadings[1]).find(".artist-stat-2").text().trim(),
        10
      );
      chart.numSongs = parseInt(
        $(chartHeadings[1]).find(".artist-stat-3").text().trim(),
        10
      );
    }

    const chartRows = $(".o-chart-results-list-row");
    if (chartRows.length === 0) {
      callback("Songs not found", null);
      return;
    }
    let index = 0;
    chartRows.each((index, element) => {
      const song = {};
      song.title = $(element).find(".artist-chart-row-title").text().trim();
      song.artist = $(element).find(".artist-chart-row-artist").text().trim();

      const debutText = $(element)
        .find(".artist-chart-row-debut-date")
        .text()
        .trim();
      song.debutDate = debutText ? convertDate(debutText) : null;

      const peakText = $(element)
        .find(".artist-chart-row-peak-pos")
        .text()
        .trim();
      song.peak = peakText ? parseInt(peakText, 10) : null;

      const peakDateText = $(element)
        .find(".artist-chart-row-peak-date")
        .text()
        .trim();
      song.peakDate = peakDateText ? convertDate(peakDateText) : null;

      const weeksText = $(element)
        .find(".artist-chart-row-week-on-chart")
        .text()
        .trim();
      song.weeksOn = weeksText ? parseInt(weeksText, 10) : null;
      song.rank = index;
      index = index + 1;
      chart.songs.push(song);
    });

    chart.songs.sort((a, b) => (a.peak || 0) - (b.peak || 0));

    if (chart.numSongs > 100) {
      chart.songs = chart.songs.slice(0, 100);
    }

    if (chartRows.length > 0) {
      callback(null, chart);
    } else {
      callback("Songs not found", null);
    }
  } catch (error) {
    logger.warn({ err: error, name }, "Error fetching Billboard artist data");
    callback(error, null);
  }
}

module.exports = { getArtist };
