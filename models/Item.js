const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    description: String,
    image: String,
    type: String,
    brand: String,
    price: Number,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// What is this?
itemSchema.set('timestamps', true);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;