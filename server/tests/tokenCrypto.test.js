const { encryptToken, decryptToken } = require("../utils/tokenCrypto");

describe("tokenCrypto", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      TOKEN_ENCRYPTION_KEY:
        "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("encrypts and decrypts a token", () => {
    const encrypted = encryptToken("spotify-token");

    expect(encrypted).toMatchObject({
      v: 1,
      alg: "aes-256-gcm",
      iv: expect.any(String),
      tag: expect.any(String),
      ciphertext: expect.any(String),
    });
    expect(encrypted.ciphertext).not.toBe("spotify-token");
    expect(decryptToken(encrypted)).toBe("spotify-token");
  });

  test("uses a unique IV for each encrypted token", () => {
    const first = encryptToken("spotify-token");
    const second = encryptToken("spotify-token");

    expect(first.iv).not.toBe(second.iv);
    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  test("throws when ciphertext is tampered with", () => {
    const encrypted = encryptToken("spotify-token");
    const tampered = {
      ...encrypted,
      ciphertext: Buffer.from("tampered").toString("base64"),
    };

    expect(() => decryptToken(tampered)).toThrow();
  });

  test("throws when key is missing or invalid", () => {
    delete process.env.TOKEN_ENCRYPTION_KEY;
    expect(() => encryptToken("spotify-token")).toThrow(
      "TOKEN_ENCRYPTION_KEY is required"
    );

    process.env.TOKEN_ENCRYPTION_KEY = Buffer.from("short").toString("base64");
    expect(() => encryptToken("spotify-token")).toThrow(
      "TOKEN_ENCRYPTION_KEY must be a 32-byte base64 value"
    );
  });

  test("throws for invalid encrypted payloads", () => {
    expect(() => decryptToken("spotify-token")).toThrow(
      "Invalid encrypted token payload"
    );
  });
});
