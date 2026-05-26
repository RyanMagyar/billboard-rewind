const express = require("express");
const request = require("supertest");
const rateLimit = require("express-rate-limit");
const { RATE_LIMIT_CONFIG } = require("../middleware/rateLimiters");

function buildApp(path, method, limiter) {
  const app = express();
  app.set("trust proxy", 1);
  app[method](path, limiter, (req, res) => {
    res.json({ ok: true });
  });
  return app;
}

describe("rate limiters", () => {
  test("configures production route limits", () => {
    expect(RATE_LIMIT_CONFIG).toEqual({
      authLogin: {
        windowMs: 15 * 60 * 1000,
        limit: 40,
        message: { message: "Too many login attempts. Please try again later." },
      },
      authCallback: {
        windowMs: 15 * 60 * 1000,
        limit: 120,
        message: {
          message: "Too many auth callbacks. Please try again later.",
        },
      },
      playlistCreate: {
        windowMs: 15 * 60 * 1000,
        limit: 20,
        message: {
          message: "Too many playlist requests. Please try again later.",
        },
      },
      artistSearch: {
        windowMs: 60 * 1000,
        limit: 240,
        message: { message: "Too many artist searches. Please slow down." },
      },
    });
  });

  test("returns 429 response bodies through express-rate-limit", async () => {
    const app = buildApp(
      "/limited",
      "get",
      rateLimit({
        windowMs: 60 * 1000,
        limit: 1,
        standardHeaders: true,
        legacyHeaders: false,
        message: RATE_LIMIT_CONFIG.playlistCreate.message,
      })
    );

    const firstResponse = await request(app).get("/limited");
    const secondResponse = await request(app).get("/limited");

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(429);
    expect(secondResponse.body).toEqual(RATE_LIMIT_CONFIG.playlistCreate.message);
  });
});
