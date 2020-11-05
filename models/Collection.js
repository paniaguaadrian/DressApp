const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name: String,
    description: String,
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    liked: {type: Boolean, default: false},
});

// What is this?
collectionSchema.set('timestamps', true);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;