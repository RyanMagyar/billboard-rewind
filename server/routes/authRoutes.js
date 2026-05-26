const express = require("express");
const {
  login,
  callback,
  checkSession,
  logout,
} = require("../controllers/authController");
const {
  authLoginLimiter,
  authCallbackLimiter,
} = require("../middleware/rateLimiters");

const router = express.Router();

router.get("/login", authLoginLimiter, login);
router.get("/callback", authCallbackLimiter, callback);
router.get("/check-session", checkSession);
router.post("/logout", logout);

module.exports = router;
