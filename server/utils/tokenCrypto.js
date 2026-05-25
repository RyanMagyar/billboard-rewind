const crypto = require("crypto");

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;

function getKey() {
  const rawKey = process.env.TOKEN_ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error("TOKEN_ENCRYPTION_KEY is required");
  }

  const key = Buffer.from(rawKey, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error("TOKEN_ENCRYPTION_KEY must be a 32-byte base64 value");
  }

  return key;
}

function encryptToken(token) {
  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Token must be a non-empty string");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    v: 1,
    alg: ALGORITHM,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: ciphertext.toString("base64"),
  };
}

function decryptToken(payload) {
  if (
    !payload ||
    payload.v !== 1 ||
    payload.alg !== ALGORITHM ||
    typeof payload.iv !== "string" ||
    typeof payload.tag !== "string" ||
    typeof payload.ciphertext !== "string"
  ) {
    throw new Error("Invalid encrypted token payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(payload.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64"));

  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

module.exports = { encryptToken, decryptToken };
