const express = require("express");
const {
  login,
  callback,
  checkSession,
  logout,
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/check-session", checkSession);
router.post("/logout", logout);

module.exports = router;
