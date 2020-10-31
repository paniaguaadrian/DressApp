const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outfitSchema = new Schema({
    name: String,
    description: String,
    imageTop: { type: Schema.Types.ObjectId, ref: 'Item'}, 
    imageBottom: { type: Schema.Types.ObjectId, ref: 'Item'}, 
    imageFeet: { type: Schema.Types.ObjectId, ref: 'Item' },
});

// What is this?
outfitSchema.set('timestamps', true);

const Outfit = mongoose.model('Outfit', outfitSchema);

module.exports = Outfit;


