const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: String,
    description: String,
    image: String,
    type: {type: String},
    brand: String,
    price: Number
});

// What is this?
itemSchema.set('timestamps', true);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;