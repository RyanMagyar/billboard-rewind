const querystring = require("querystring");
const { login, callback, logout } = require("../controllers/authController");
const { decryptToken } = require("../utils/tokenCrypto");

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
      TOKEN_ENCRYPTION_KEY:
        "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
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
    expect(req.session.access_token).toMatchObject({
      v: 1,
      alg: "aes-256-gcm",
      iv: expect.any(String),
      tag: expect.any(String),
      ciphertext: expect.any(String),
    });
    expect(req.session.refresh_token).toMatchObject({
      v: 1,
      alg: "aes-256-gcm",
      iv: expect.any(String),
      tag: expect.any(String),
      ciphertext: expect.any(String),
    });
    expect(req.session.access_token.ciphertext).not.toBe("access_token");
    expect(req.session.refresh_token.ciphertext).not.toBe("refresh_token");
    expect(decryptToken(req.session.access_token)).toBe("access_token");
    expect(decryptToken(req.session.refresh_token)).toBe("refresh_token");
    expect(req.session.expires_at).toEqual(expect.any(Number));
    expect(res.redirect).toHaveBeenCalledWith("https://music.example.com/");
  });

  test("logout destroys the session and clears the session cookie", () => {
    process.env.NODE_ENV = "prod";
    const req = {
      session: {
        destroy: jest.fn((callback) => callback()),
      },
    };
    const res = {
      clearCookie: jest.fn(),
      sendStatus: jest.fn(),
    };

    logout(req, res);

    expect(req.session.destroy).toHaveBeenCalledTimes(1);
    expect(res.clearCookie).toHaveBeenCalledWith("session", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: ".chachfilms.com",
    });
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });

  test("logout returns 500 when session destroy fails", () => {
    const req = {
      session: {
        destroy: jest.fn((callback) => callback(new Error("destroy failed"))),
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    logout(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Logout failed" });
  });
});
