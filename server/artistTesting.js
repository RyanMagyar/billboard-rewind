const request = require("request");
const cheerio = require("cheerio");

const BILLBOARD_BASE_URL = "http://www.billboard.com";
const BILLBOARD_ARTIST_URL = `${BILLBOARD_BASE_URL}/artist/`;

async function getArtist(name, cb) {
  let artist = name.replace(/ /g, "-");
  console.log("Artist: " + artist);

  const requestURL = `${BILLBOARD_ARTIST_URL}${artist}/chart-history/hsi/`;
  console.log("Request Url: " + requestURL);

  request(requestURL, (error, response, html) => {
    if (error) {
      console.log(error);
      callback(error, null);
      return;
    }

    const $ = cheerio.load(html);

    console.log($);
  });
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
