const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  serialNumber: { type: String, required: true },
  macId: { type: String, required: true },
  commissionedDate: { type: Date, required: true },
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;