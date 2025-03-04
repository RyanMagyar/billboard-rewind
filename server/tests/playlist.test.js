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
    const queries = [
      { chart: "Rock", date: "" },
      { chart: "", date: "12-31-2023" },
      { chart: "", date: "" },
    ];

    for (const query of queries) {
      const response = await request(app)
        .post("/playlist/createPlaylist")
        .query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Missing query params!");
    }
  });

  test("Should return 400 for incorrect date format", async () => {
    const queries = [
      { chart: "Rock", date: "21-01-2024" },
      { chart: "Rock", date: "1-31-2023" },
      { chart: "Rock", date: "10-1-2012" },
      { chart: "Rock", date: "2012-10-10" },
    ];
    for (const query of queries) {
      const response = await request(app)
        .post("/playlist/createPlaylist")
        .query(query);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Improper date format.");
    }
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

  test("Should return 402 when missing refresh token on refresh", async () => {
    jest.resetModules();
    const { refreshToken } = require("../utils/spotifyApi");
    refreshToken.mockResolvedValue(402);
    jest.mock("cookie-session", () => {
      return jest.fn(() => (req, res, next) => {
        req.session = {
          access_token: "mockAccessToken",
          expires_at: Date.now() - 10000,
          refresh_token: "",
        };
        next();
      });
    });

    app = require("../app");

    const response = await request(app)
      .post("/playlist/createPlaylist")
      .query({ chart: "Rock", date: "12-31-2023" });

    expect(refreshToken.mock.calls.length).toBe(1);
    expect(response.status).toBe(402);
    expect(response.text).toBe("Token Refresh Error");
  });

  test("Should refresh token if expired", async () => {
    jest.resetModules();
    const {
      refreshToken,
      searchTracks,
      createPlaylist,
    } = require("../utils/spotifyApi");
    refreshToken.mockResolvedValue(200);
    jest.mock("cookie-session", () => {
      return jest.fn(() => (req, res, next) => {
        req.session = {
          access_token: "mockAccessToken",
          expires_at: Date.now() - 10000,
          refresh_token: "mockRefreshToken",
        };
        next();
      });
    });
    searchTracks.mockResolvedValue({
      uriArray: ["spotify:track:123"],
      failedArray: [],
    });

    createPlaylist.mockResolvedValue({
      id: "mock_playlist_id",
    });

    app = require("../app");
    const response = await request(app)
      .post("/playlist/createPlaylist")
      .query({ chart: "Rock", date: "12-31-2023" })
      .send([{ artist: "Coldplay", title: "Fix You", rank: 1 }]);

    expect(refreshToken.mock.calls.length).toBe(1);
    expect(response.status).toBe(200);
  });
});
