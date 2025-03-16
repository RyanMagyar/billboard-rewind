const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const BILLBOARD_BASE_URL = "http://www.billboard.com";
const BILLBOARD_ARTIST_URL = `${BILLBOARD_BASE_URL}/artist/`;
