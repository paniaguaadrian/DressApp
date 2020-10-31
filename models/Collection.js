const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    title: String,
    description: String,
    outfits: [{ type: Schema.Types.ObjectId, ref: 'Outfit' }], 
});

// What is this?
collectionSchema.set('timestamps', true);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;