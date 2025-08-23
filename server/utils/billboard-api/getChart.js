const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const BILLBOARD_BASE_URL = "http://www.billboard.com";
const BILLBOARD_CHARTS_URL = `${BILLBOARD_BASE_URL}/charts/`;

function getChart(name, date, cb) {
  let chartName = name;
  let chartDate = date;
  let callback = cb;

  if (typeof name === "function") {
    callback = name;
    chartName = "hot-100";
    chartDate = "";
  }

  if (typeof date === "function") {
    callback = date;
    chartDate = "";
  }

  const chart = {};
  chart.songs = [];

  const requestURL = `${BILLBOARD_CHARTS_URL}${chartName}/${chartDate}`;
  request(requestURL, (error, response, html) => {
    if (error) {
      callback(error, null);
      return;
    }

    const $ = cheerio.load(html);

    // Week parsing may need a new selector, adjust if Billboard changed headers
    let d = null;
    $(".c-heading").each((i, el) => {
      const text = $(el).text();
      if (text.includes("Week of ")) {
        d = moment(new Date(text.replace("Week of ", "").trim()));
      }
    });

    if (d) {
      chart.week = d.format("YYYY-MM-DD");

      const prevWeek = d.clone().subtract(7, "days").format("YYYY-MM-DD");
      chart.previousWeek = {
        date: prevWeek,
        url: `${BILLBOARD_CHARTS_URL}${chartName}/${prevWeek}`,
      };

      const nextWeek = d.clone().add(7, "days").format("YYYY-MM-DD");
      chart.nextWeek = {
        date: nextWeek,
        url: `${BILLBOARD_CHARTS_URL}${chartName}/${nextWeek}`,
      };
    }

    // Billboard changed row container class
    const chartItems = $(".o-chart-results-list-row");
    chartItems.each((i, el) => {
      const row = $(el);

      const rank = parseInt(
        row.find("li span.c-label").first().text().trim(),
        10
      );

      const title = row.find("h3#title-of-a-story").text().trim();
      const artist = row.find("h3#title-of-a-story").next("span").text().trim();

      // cover image
      let cover = row.find("img.c-lazy-image__img").attr("data-lazy-src");
      if (!cover || cover.includes("lazyload-fallback.gif")) {
        cover = row.find("img.c-lazy-image__img").attr("src");
      }

      // positions (LW, PEAK, WEEKS)
      const position = {};
      row.find("div.lrv-u-flex").each((_, block) => {
        const label = $(block).find("span.c-span").text().trim().toLowerCase();
        const value = $(block).find("span.c-label").text().trim();
        if (label.includes("last"))
          position.positionLastWeek = parseInt(value, 10) || 0;
        if (label.includes("peak"))
          position.peakPosition = parseInt(value, 10) || 0;
        if (label.includes("week"))
          position.weeksOnChart = parseInt(value, 10) || 0;
      });

      if (artist) {
        chart.songs.push({ rank, title, artist, cover, position });
      } else {
        chart.songs.push({ rank, artist: title, cover, position });
      }
    });

    if (chart.songs.length > 1) {
      callback(null, chart);
    } else {
      callback("Songs not found.", null);
    }
  });
}

module.exports = {
  getChart,
};
