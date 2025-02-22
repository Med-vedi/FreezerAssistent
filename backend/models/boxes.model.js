const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    id: String,
    title: String,
    shelves_id: [String],
    type: String
}, { collection: 'boxes' });

module.exports = mongoose.model('Box', boxSchema);