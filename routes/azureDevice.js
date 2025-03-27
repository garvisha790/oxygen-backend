const express = require("express");
const router = express.Router();
const { registerDeviceInAzure } = require("../services/azureService");

// Register a new device in Azure IoT Hub
router.post("/register-device", async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ success: false, message: "Device ID is required" });
  }

  try {
    const response = await registerDeviceInAzure(deviceId);
    res.json(response);
  } catch (error) {
    console.error("Error registering device in Azure:", error);
    res.status(500).json({ success: false, message: "Azure IoT Hub registration failed.", error });
  }
});

module.exports = router;