const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const topCloud = require("../../config/cloudinary");
const withAuth = require("../../middleware/auth");

router.get("/", withAuth, async (req, res, next) => {
  const user = await User.findById(req.userID);
  res.render("private/profile", { user });
});

router.get("/edit-profile", withAuth, async (req, res, next) => {
  const user = await User.findById(req.userID);
  res.render("private/edit-profile.hbs", { user });
});

router.post(
  "/edit-profile",
  withAuth,
  topCloud.single("photo"),
  async (req, res, next) => {
    const { description } = req.body;
    console.log(req.body);
    // const image = req.file.url;
    // console.log(`photo: ${image}`);
    await User.findByIdAndUpdate(req.userID, {
      description: description,
    });
    res.redirect("/myprofile");
  }
);

module.exports = router;
