const Device = require('../models/Device');

exports.getDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addDevice = async (req, res) => {
    try {
        const { deviceName, serialNumber, macId, commissionedDate } = req.body;

        if (!deviceName || !serialNumber || !macId || !commissionedDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newDevice = new Device({ deviceName, serialNumber, macId, commissionedDate });
        await newDevice.save();
        res.status(201).json(newDevice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndDelete(req.params.id);
        if (!device) return res.status(404).json({ message: 'Device not found' });
        res.json({ message: 'Device deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};