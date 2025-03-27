const express = require('express');
const router = express.Router();
const Device = require('../models/Device');

// GET devices (with optional plantId filter)
router.get('/', async (req, res) => {
  try {
    const { plantId } = req.query;
    const devices = plantId
      ? await Device.find({ plantId })
      : await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST (Add) a device
router.post('/', async (req, res) => {
  try {
    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(400).json({ message: 'Error adding device' });
  }
});

// DELETE a device
router.delete('/:id', async (req, res) => {
  try {
    await Device.findByIdAndDelete(req.params.id);
    res.json({ message: 'Device deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device' });
  }
});

module.exports = router;