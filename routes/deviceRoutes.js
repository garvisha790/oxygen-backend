const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAllDevices, getDevicesByHospital, getDeviceModel } = require('../controllers/deviceController');

// Get all devices (protected by auth)
router.get('/', authMiddleware, getAllDevices);

// Get devices by hospital name (protected by auth)
router.get('/:hospital', authMiddleware, getDevicesByHospital);

// ✅ Add route for deviceModel (no auth for testing)
router.get('/deviceModel', (req, res) => {
  res.json({ model: 'DHT11', status: 'Active' });
});

module.exports = router;