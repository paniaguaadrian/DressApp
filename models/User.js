const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    // name: String,
    name: String,
    email: String,
    password: String,
    googleId: String,
    // password: { type: String, required: true },
    description: String,
    // TODO add a default picture
    image: { type: String, default: "./images/profile-default.png" },
    outfits: [{ type: Schema.Types.ObjectId, ref: "Outfit" }],
    items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
    collections: [{ type: Schema.Types.ObjectId, ref: "Collections" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
