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
    const { description, imageBefore, name, email } = req.body;
    if (req.file) {
      image = req.file.url;
    } else if (!req.file || req.file === "") {
      image = imageBefore;
    }

    await User.findByIdAndUpdate(
      { _id: req.userID },
      { $set: { description, image, name, email } }
    );
    res.redirect("/myprofile");
  }
);

module.exports = router;
