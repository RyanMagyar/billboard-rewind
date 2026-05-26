const rateLimit = require("express-rate-limit");

const RATE_LIMIT_CONFIG = {
  authLogin: {
    windowMs: 15 * 60 * 1000,
    limit: 40,
    message: { message: "Too many login attempts. Please try again later." },
  },
  authCallback: {
    windowMs: 15 * 60 * 1000,
    limit: 120,
    message: { message: "Too many auth callbacks. Please try again later." },
  },
  playlistCreate: {
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { message: "Too many playlist requests. Please try again later." },
  },
  artistSearch: {
    windowMs: 60 * 1000,
    limit: 240,
    message: { message: "Too many artist searches. Please slow down." },
  },
};

function createLimiter(config) {
  return rateLimit({
    ...config,
    standardHeaders: true,
    legacyHeaders: false,
  });
}

const authLoginLimiter = createLimiter(RATE_LIMIT_CONFIG.authLogin);
const authCallbackLimiter = createLimiter(RATE_LIMIT_CONFIG.authCallback);
const playlistCreateLimiter = createLimiter(RATE_LIMIT_CONFIG.playlistCreate);
const artistSearchLimiter = createLimiter(RATE_LIMIT_CONFIG.artistSearch);

module.exports = {
  RATE_LIMIT_CONFIG,
  authLoginLimiter,
  authCallbackLimiter,
  playlistCreateLimiter,
  artistSearchLimiter,
};
