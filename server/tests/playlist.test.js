const request = require("supertest");
const app = require("../app");
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

describe("POST /playlist/createPlaylist", () => {
  let mockSession;

  beforeEach(() => {
    mockSession = {
      access_token: "mock_access_token",
      expires_at: Date.now() + 3600 * 1000,
      refresh_token: "mock_refresh_token",
    };
  });

  test("Should return 402 when access token is missing", async () => {
    delete mockSession.access_token; // Remove access token

    const response = await request(app)
      .post("/playlist/createPlaylist")
      .set("Cookie", [`session=${JSON.stringify(mockSession)}`])
      .query({ chart: "Rock", date: "12-31-2023" });

    expect(response.status).toBe(402);
    expect(response.text).toBe("Error No Access Token");
  });
});
