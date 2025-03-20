const mongoose = require('mongoose');
const deviceSchema = new mongoose.Schema({
    name: String,
    status: String,
    hospital: String,
    logs: Array,
});
module.exports = mongoose.model('Device', deviceSchema);