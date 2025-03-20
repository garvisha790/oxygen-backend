const Device = require('../models/deviceModel');

exports.getAllDevices = async (req, res) => {
    const devices = await Device.find();
    res.json(devices);
};

exports.getDevicesByHospital = async (req, res) => {
    const devices = await Device.find({ hospital: req.params.hospital });
    res.json(devices);
};
