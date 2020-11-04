const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
    name: { type: Schema.Types.ObjectId, ref: "User" },
    type: String, 
    collections: { type: Schema.Types.ObjectId, ref: "Collection" }, 
    item: { type: Schema.Types.ObjectId, ref: "Item" }, 
    outfit: { type: Schema.Types.ObjectId, ref: "Outfit" }, 
    // switch: {type: Boolean, default: true}
    },
    { timestamps: true }
    );

// What is this?
notificationSchema.set('timestamps', true);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;