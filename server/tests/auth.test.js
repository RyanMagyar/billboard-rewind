const querystring = require("querystring");
const { login, callback } = require("../controllers/authController");

describe("Spotify auth controller", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      CLIENT_ID: "client_id",
      CLIENT_SECRET: "client_secret",
      SERVER_URL: "https://api.example.com",
      CLIENT_URL: "https://music.example.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  test("login stores a random OAuth state in session and redirects with it", () => {
    const req = { session: {} };
    const res = { redirect: jest.fn() };

    login(req, res);

    expect(req.session.spotify_auth_state).toMatch(/^[a-f0-9]{32}$/);
    expect(res.redirect).toHaveBeenCalledTimes(1);

    const redirectUrl = new URL(res.redirect.mock.calls[0][0]);
    expect(redirectUrl.origin + redirectUrl.pathname).toBe(
      "https://accounts.spotify.com/authorize"
    );

    const params = querystring.parse(redirectUrl.search.slice(1));
    expect(params.state).toBe(req.session.spotify_auth_state);
    expect(params.redirect_uri).toBe("https://api.example.com/auth/callback");
  });

  test("callback rejects missing or mismatched OAuth state before token exchange", async () => {
    global.fetch = jest.fn();

    const req = {
      query: { code: "auth_code", state: "wrong_state" },
      session: { spotify_auth_state: "expected_state" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await callback(req, res);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(req.session.spotify_auth_state).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid authorization state",
    });
  });

  test("callback exchanges code when OAuth state matches", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        access_token: "access_token",
        refresh_token: "refresh_token",
        expires_in: 3600,
      }),
    });

    const req = {
      query: { code: "auth_code", state: "expected_state" },
      session: { spotify_auth_state: "expected_state" },
    };
    const res = { redirect: jest.fn() };

    await callback(req, res);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(req.session.spotify_auth_state).toBeUndefined();
    expect(req.session.access_token).toBe("access_token");
    expect(req.session.refresh_token).toBe("refresh_token");
    expect(req.session.expires_at).toEqual(expect.any(Number));
    expect(res.redirect).toHaveBeenCalledWith("https://music.example.com/");
  });
});
