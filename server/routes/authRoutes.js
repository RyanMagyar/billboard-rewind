const express = require("express");
const {
  login,
  callback,
  checkSession,
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/check-session", checkSession);

module.exports = router;
