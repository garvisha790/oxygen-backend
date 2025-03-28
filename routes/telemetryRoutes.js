const express = require("express");
const router = express.Router();
const { CosmosClient } = require("@azure/cosmos");

// Azure CosmosDB Config
const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;
const databaseId = process.env.COSMOSDB_DATABASE;
const containerId = process.env.COSMOSDB_CONTAINER;

const client = new CosmosClient({ endpoint, key });

router.get("/telemetry/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;

        if (!deviceId) {
            return res.status(400).json({ error: "Device ID is required" });
        }

        const querySpec = {
            query: "SELECT * FROM c WHERE c.device_id = @deviceId ORDER BY c._ts DESC",
            parameters: [{ name: "@deviceId", value: deviceId }]
        };

        const { resources: telemetryData } = await client
            .database(databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll();

        if (telemetryData.length === 0) {
            return res.status(404).json({ message: "No telemetry data found for this device" });
        }

        // Format timestamps for frontend display
        const formattedData = telemetryData.map((data) => ({
            ...data,
            timestamp: new Date(data._ts * 1000).toLocaleString(), // Convert Unix timestamp (_ts) to readable format
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching telemetry:", error.message);
        res.status(500).json({ error: "Failed to fetch telemetry data" });
    }
});

module.exports = router;