const iothub = require("azure-iothub");

// Your Azure IoT Hub Connection String
const connectionString = process.env.IOT_HUB_CONNECTION_STRING;
const registry = iothub.Registry.fromConnectionString(connectionString);

// Function to register a device in Azure IoT Hub
const registerDeviceInAzure = async (deviceId) => {
  const device = { deviceId };

  try {
    await registry.create(device);
    return { success: true, message: `Device ${deviceId} registered successfully in Azure IoT Hub. `};
  } catch (error) {
    if (error.code === 409) {
      return { success: true, message: `Device ${deviceId} already exists in Azure IoT Hub.` };
    } else {
      throw error;
    }
  }
};

module.exports = { registerDeviceInAzure };