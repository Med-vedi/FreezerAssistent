const mongoose = require('mongoose');

const boxSchema = new mongoose.Schema({
    id: String,
    title: String,
    shelves_ids: [String],
    type: String,
    user_id: String
}, { collection: 'boxes' });

module.exports = mongoose.model('Box', boxSchema);