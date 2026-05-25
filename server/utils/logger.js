const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "access_token",
      "refresh_token",
      "*.access_token",
      "*.refresh_token",
      "*.token",
      "*.CLIENT_SECRET",
    ],
    censor: "[redacted]",
  },
});

module.exports = logger;
