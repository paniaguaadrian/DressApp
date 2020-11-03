const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
    name: String,
    description: String,
    imageTop: String, 
    imageBottom: String, 
    imageFeet: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

// What is this?
outfitSchema.set('timestamps', true);

const Outfit = mongoose.model('Outfit', outfitSchema);

module.exports = Outfit;


