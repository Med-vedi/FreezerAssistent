
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    category: String,
    category_id: { type: Number, required: true },
    emoji: { type: String, required: true },
    en: String,
    it: String,
    expiration_date: Date,
    box_id: String,
    shelf_id: String,
    count: Number,
}, { collection: 'products' });

module.exports = mongoose.model('Product', productSchema);