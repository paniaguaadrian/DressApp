const bcrypt = require("bcrypt");
const passport = require("passport");

const router = require("express").Router();

const User = require("../models/User");


// * Loggin route
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up",
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
    }

    if (!user.password) {
      return res.send("Email not registered locally. Sign in with google");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.send("Incorrect email or password");
    }

    req.login(user, (error) => {
      if (error) {
        console.log(error);
        return res.send("Something went wrong");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).redirect("/dashboard");
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// * Sign up route
router.post("/auth/signup", async (req, res) => {
  const { email, name, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.send("Email already registered");
    }

    user = await User.create({ name, email, password });

    console.log("Sign up successful");

    res.status(201).redirect("/");
  } catch (error) {
    console.log(error);
  }
});

router.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
