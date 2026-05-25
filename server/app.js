const express = require("express");
const { getChart } = require("billboard-top-100");
var querystring = require("querystring");
const moment = require("moment");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const cors = require("cors");
const expAutoSan = require("express-autosanitizer");
const pinoHttp = require("pino-http");

let envPath;

if (process.env.NODE_ENV === "prod") {
  envPath = ".env.prod";
} else if (process.env.NODE_ENV === "dev") {
  envPath = ".env.dev";
} else if (process.env.NODE_ENV === "test") {
  envPath = ".env.test";
} else {
  throw Error("No NODE_ENV found");
}

require("dotenv").config({
  path: envPath,
});

const logger = require("./utils/logger");
const { pool } = require("./db");
const app = express();
const port = 3000;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SECRET = process.env.SECRET;
const SERVER_URL = process.env.SERVER_URL;
const CLIENT_URL = process.env.CLIENT_URL;
const REDIRECT_URI = "http://localhost:3000/callback";

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE_URL = "https://api.spotify.com/v1/";

app.set("trust proxy", 1);

app.use(express.json());

app.use(expAutoSan.all);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url,
          remoteAddress: req.remoteAddress,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
    customLogLevel(req, res, err) {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  })
);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

const sessionCookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === "prod" ? true : false,
  httpOnly: true,
};

if (process.env.NODE_ENV === "prod") {
  sessionCookieOptions.domain = ".chachfilms.com";
}

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 60,
    }),
    name: "session",
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: sessionCookieOptions,
  })
);

const chartRoutes = require("./routes/chartRoutes");
app.use("/charts", chartRoutes);

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

const playlistRoutes = require("./routes/playlistRoutes");

app.use("/playlist", playlistRoutes);

const artistRoutes = require("./routes/artistRoutes");

app.use("/artist", artistRoutes);

app.get("/", (req, res) => {
  res.send("Hello <a href='login'>Login with Spotify</a>");
});
module.exports = app;
