const express = require('express');
const router = express.Router();
const { saveTelemetryData, getTelemetryData } = require('../config/CosmosDB');

// ✅ POST route to store telemetry data
router.post('/', async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No telemetry data provided" });
        }

        const savedTelemetry = await saveTelemetryData(req.body);
        res.status(201).json({ message: "Telemetry data saved successfully", data: savedTelemetry });
    } catch (error) {
        console.error('❌ Error saving telemetry:', error.message);
        res.status(500).json({ error: 'Error saving telemetry data' });
    }
});

// ✅ GET route to fetch ALL telemetry data
router.get('/', async (req, res) => {
    try {
        const telemetryData = await getTelemetryData();  // Fetch all telemetry data
        res.json(telemetryData);
    } catch (error) {
        console.error('❌ Error fetching telemetry:', error.message);
        res.status(500).json({ error: 'Error fetching telemetry data' });
    }
});

// ✅ GET route to fetch telemetry data by deviceId
router.get('/:deviceId', async (req, res) => {
    try {
        const { deviceId } = req.params;
        if (!deviceId) {
            return res.status(400).json({ error: "Device ID is required" });
        }

        const telemetryData = await getTelemetryData(deviceId); // Fetch by device ID
        if (!telemetryData.length) {
            return res.status(404).json({ message: "No telemetry data found for this device" });
        }

        res.json(telemetryData);
    } catch (error) {
        console.error('❌ Error fetching telemetry:', error.message);
        res.status(500).json({ error: 'Error fetching telemetry data' });
    }
});

module.exports = router;