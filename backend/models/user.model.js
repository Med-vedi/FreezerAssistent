const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);