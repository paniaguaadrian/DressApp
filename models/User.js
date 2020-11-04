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
    notification: [{ name: String, collections: { type: Schema.Types.ObjectId, ref: "Collection" }, items: { type: Schema.Types.ObjectId, ref: "Item" }, outfits: { type: Schema.Types.ObjectId, ref: "Outfit" }, switch: {type: Boolean, default: true}}],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
