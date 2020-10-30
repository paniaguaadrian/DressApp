const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/authG");
const withAuth = require("../middleware/auth");

// * @desc    Login/Landing page
// * @route   GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login");
});

router.get("/signup", ensureGuest, (req, res) => {
  res.render("signup");
});

// * @desc    Dashboard
// * @route   GET /dashboard
// ! OJO CAMBIAR ESTA RUTA TAMBIEN CON LA FINAL DE LA APP!!!!
router.get("/dashboard", ensureAuth, (req, res) => {
  res.render("dashboard");
});

// * @desc    Dashboard Comun Login
// * @route   GET /dashboardLoginComun
// router.get("/", withAuth, (req, res) => {
//   res.render("private/closet/index");
// });

module.exports = router;
