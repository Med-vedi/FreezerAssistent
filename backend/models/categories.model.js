
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    en: String,
    it: String,
}, { collection: 'categories' });

module.exports = mongoose.model('Category', categorySchema);