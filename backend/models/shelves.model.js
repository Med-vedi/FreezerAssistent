const mongoose = require('mongoose');

const shelfSchema = new mongoose.Schema({
    id: { type: String, required: true },
    level: { type: String, required: true },
    box_id: { type: String, required: true },
    products: { type: Array },
    createdAt: { type: Date, default: () => new Date() },
}, { collection: 'shelves' });

module.exports = mongoose.model('Shelf', shelfSchema);