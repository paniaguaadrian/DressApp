const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // name: String,
    name: String,
    email: String,
    password: String,
    // password: { type: String, required: true },
    description: String,
    // TODO add a default picture
    image: { type: String, default: "./images/profile-default.png" },
    outfits: [{ type: Schema.Types.ObjectId, ref: "Outfit" }],
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
