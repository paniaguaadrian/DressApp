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
  if (email === "" || password === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to login",
    });
    return;
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.render("login", {
        errorMessage: "The email doesn't exist.",
      });
      return;
    } else if (bcrypt.compareSync(password, user.password)) {
      const userWithoutPass = await User.findOne({ email }).select("-password");
      const payload = { userID: userWithoutPass._id };

      const token = jwt.sign(payload, process.env.SECRET_SESSION, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.status(200).redirect("/mycloset");
    } else {
      res.render("login", { errorMessage: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
  }
});

// * Sign up route ////////////////////////////////////////////////////////////////////

router.get("/signup", (req, res, next) => {
  res.render("signup", { errorMessage: "" });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if ((email === "") | (password === "") || name === "") {
    res.render("signup", {
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

    const theUser = new User(userSubmission);
    theUser.save((err) => {
      if (err) {
        res.render("signup", {
          errorMessage: "Something went wrong. Try again later",
        });
        return;
      }
      console.log("hello man");
      res.redirect("/");
    });
  } catch (error) {
    next(error);
    return;
  }
});

// * Log out route ////////////////////////////////////////////////////////////////////

router.get("/logout", withAuth, (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/");
});

module.exports = router;
