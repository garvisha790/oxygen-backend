const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantName: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Plant', plantSchema);