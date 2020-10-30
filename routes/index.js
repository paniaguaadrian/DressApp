const express = require("express");
const router = express.Router();
const withAuth = require("../middleware/auth");

router.get("/", withAuth, (req, res, next) => {
  res.render("login");
});

router.get("/signup", withAuth, (req, res, next) => {
  res.render("signup");
});
module.exports = router;
