jest.mock("cookie-session", () => {
  return jest.fn(() => (req, res, next) => {
    req.session = {
      access_token: "mockAccessToken",
      expires_at: Date.now() + 10000,
    };
    next();
  });
});

const request = require("supertest");
let app = require("../app");
const {
  searchTracks,
  createPlaylist,
  refreshToken,
} = require("../utils/spotifyApi");

jest.mock("../utils/spotifyApi", () => ({
  searchTracks: jest.fn(),
  createPlaylist: jest.fn(),
  refreshToken: jest.fn(),
}));

afterEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
});

describe("POST /playlist/createPlaylist", () => {
  let mockSession;

  beforeEach(() => {
    mockSession = {
      access_token: "mock_access_token",
      expires_at: Date.now() + 3600 * 1000,
      refresh_token: "mock_refresh_token",
    };
  });

  test("Should return 400 for missing query parameters", async () => {
    const response = await request(app)
      .post("/playlist/createPlaylist")
      .query({ chart: "", date: "12-31-2023" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing query params!");
  });

  test("Should return 400 for missing query parameters", async () => {
    const response = await request(app)
      .post("/playlist/createPlaylist")
      .query({ chart: "Rock", date: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Missing query params!");
  });

  test("Should return 402 when access token is missing", async () => {
    jest.resetModules();
    jest.mock("cookie-session", () => {
      return jest.fn(() => (req, res, next) => {
        req.session = {}; // No access_token
        next();
      });
    });

    app = require("../app");

    const response = await request(app)
      .post("/playlist/createPlaylist")
      .query({ chart: "Rock", date: "12-31-2023" });

    expect(response.status).toBe(402);
    expect(response.text).toBe("Error No Access Token");
  });
});
