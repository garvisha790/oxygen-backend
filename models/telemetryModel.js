const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  oilLevel: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Telemetry', telemetrySchema);
