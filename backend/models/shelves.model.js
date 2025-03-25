const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    id: { type: String, required: true },
    level: { type: String, required: true },
    box_id: { type: String, required: true },
    products: [{
        id: String,
        category_id: Number,
        emoji: String,
        name: String,
        expiration_date: Date,
        shelf_id: String,
        box_id: String,
        notes: String,
        count: Number
    }],
    createdAt: { type: Date, default: () => new Date() },
}, { collection: 'shelves' });

module.exports = mongoose.model('Shelf', shelfSchema);