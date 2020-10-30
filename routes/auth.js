const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const withAuth = require("../middleware/auth");

// * Loggin route ///////////////////////////////////////////////////////////////////

router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: "" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (email === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      res.render("login", {
        errorMessage: "The email doesn't exist.",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      console.log("ingresa el cif");
      const userWithoutPass = await User.findOne({ email }).select("-password");
      const payload = { userID: userWithoutPass._id };

      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      // ! Problema
      res.status(200).redirect("/mycloset");
      // res.render("dashboard");
    } else {
      res.render("login", { errorMessage: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
  }
});

// * Sign up route ////////////////////////////////////////////////////////////////////

router.get("/signup", (req, res, next) => {
  res.render("auth/signup", { errorMessage: "" });
});

router.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;

  if ((email === "") | (password === "") || name === "") {
    res.render("auth/signup", {
      errorMessage: "Enter name, email and password to sign up",
    });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser !== null) {
      res.render("signup", {
        errorMessage: `The email ${email} is already in use`,
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);
    const userSubmission = { name: name, email: email, password: hashedPass };

    await User.create(userSubmission);

    res.redirect("/mycloset");
  } catch (error) {
    next(error);
    return;
  }
});

// * Log out route ////////////////////////////////////////////////////////////////////

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
