const path = require("path");
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const topCloud = require("../../config/cloudinary");
const withAuth = require("../../middleware/auth");

router.get("/", withAuth, async (req, res, next) => {
  res.render("private/profile");
});

module.exports = router;
