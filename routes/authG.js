const express = require("express");
const passport = require("passport");
const router = express.Router();

// * @desc    Auth with Google
// * @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// * @desc    Google auth Callback
// * @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // * Si todo sale bien, nos llevara al dashboard.
    // ! OJO, CAMBIAR ESTA RUTA A NUESTRA APP UNA VEZ LA TENGAMOS CREADA, ESTE DASHBOARD ES UN SIMPLE TEST!!!!!!
    res.redirect("/dashboard");
  }
);

module.exports = router;