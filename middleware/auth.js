const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_SESSION;

const User = require("../models/User");

const withAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.locals.isUserLoggedIn = false;
      next();
    } else {
      const decoded = await jwt.verify(token, secret);

      req.userID = decoded.userID;
      res.locals.currentUserInfo = await User.findById(req.userID);
      res.locals.isUserLoggedIn = true;
      next();
    }
  } catch (error) {
    console.error(error);
    res.locals.isUserLoggedIn = false;
    next(error);
    res.redirect("/");
  }
};

module.exports = withAuth;
