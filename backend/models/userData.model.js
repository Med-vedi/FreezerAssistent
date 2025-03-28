const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    category_id: Number,
    emoji: String,
    en: String,
    it: String,
    box_id: String,
    shelf_id: String,
    count: Number,
    notes: String,
    expiration_date: Date,
    createdAt: Date,
    updatedAt: Date
}, { _id: false });

const userDataSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    products: {
        type: [productSchema],
        default: []
    },
    products_all: {
        type: [productSchema],
        default: []
    }
}, { collection: 'user_data' });

module.exports = mongoose.model('UserData', userDataSchema);