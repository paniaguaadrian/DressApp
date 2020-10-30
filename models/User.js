<<<<<<< HEAD
const mongoose = require("mongoose");


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

const User = mongoose.model("User", userSchema);

module.exports = User;
=======
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    description: String,
    // TODO add a default picture
    image: { type: String, default: './images/profile-default.png' },
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    collections: [{ type: Schema.Types.ObjectId, ref: 'Collections' }]
});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
>>>>>>> branch-eric
