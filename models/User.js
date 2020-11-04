const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // name: String,
    name: String,
    email: String,
    password: String,
    description: String,
    image: { type: String, default: "images/profile-default.svg" },
    outfits: [{ type: Schema.Types.ObjectId, ref: "Outfit" }],
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    notification: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
