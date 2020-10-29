const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/authG");

// * @desc    Login/Landing page
// * @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

// * @desc    Dashboard
// * @route   GET /dashboard
// ! OJO CAMBIAR ESTA RUTA TAMBIEN CON LA FINAL DE LA APP!!!!
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard", { name: req.user.firstName });
});

module.exports = router;
