const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const topCloud = require("../../config/cloudinary");
const withAuth = require("../../middleware/auth");

router.get("/", withAuth, async (req, res, next) => {
  res.render("private/profile");
});

router.get("/edit-profile", withAuth, async (req, res, next) => {
  let user = await User.findById(req.userID);
  res.render("private/edit-profile.hbs", { user });
  // console.log(`user: ${user}`);
});

router.post("/edit-profile", async (req, res, next) => {
  const updatedUser = {
    description: req.body.description,
  };
  let { description } = req.body;
  console.log(`req.body.description: ${req.body.description}`);
  User.update({ _id: req.userID }, updatedUser);
  console.log(`updatedUser: ${updatedUser}`);
  console.log(`req.userID: ${req.userID}`);

  // await User.findByIdAndUpdate({ $set: { description } });
  res.redirect("/myprofile");
});

module.exports = router;
