const express = require("express");
const router = express.Router();
const { CosmosClient } = require("@azure/cosmos");

// Azure CosmosDB Config from environment variables
const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;
const databaseId = process.env.COSMOSDB_DATABASE;
const containerId = process.env.COSMOSDB_CONTAINER;

// Log CosmosDB configuration (without the key for security)
console.log("CosmosDB Configuration:");
console.log(`Endpoint: ${endpoint ? (endpoint.substring(0, 15) + '...') : 'Not set'}`);
console.log(`Database ID: ${databaseId || 'Not set'}`);
console.log(`Container ID: ${containerId || 'Not set'}`);

// Create a client with the credentials
const client = new CosmosClient({ endpoint, key });

// Simple diagnostic endpoint that returns all data in the container
router.get("/diagnostic", async (req, res) => {
    try {
        console.log("🔍 Running CosmosDB diagnostic...");
        
        // Check if connection parameters exist
        if (!endpoint || !key || !databaseId || !containerId) {
            return res.status(500).json({
                error: "CosmosDB configuration incomplete",
                missingParams: {
                    endpoint: !endpoint,
                    key: !key,
                    databaseId: !databaseId,
                    containerId: !containerId
                }
            });
        }
        
        // Access the database and container
        const database = client.database(databaseId);
        const container = database.container(containerId);
        
        // Query for all data (limited to 100 records)
        const query = {
            query: "SELECT TOP 100 * FROM c ORDER BY c._ts DESC"
        };
        
        const { resources: allData } = await container.items.query(query).fetchAll();
        
        // Get a count of all records in the container
        const countQuery = {
            query: "SELECT VALUE COUNT(1) FROM c"
        };
        
        const { resources: countResult } = await container.items.query(countQuery).fetchAll();
        const totalCount = countResult && countResult.length > 0 ? countResult[0] : 0;
        
        // Get all unique device IDs
        const deviceQuery = {
            query: "SELECT DISTINCT VALUE c.device_id FROM c"
        };
        
        const { resources: deviceIds } = await container.items.query(deviceQuery).fetchAll();
        
        console.log(`Found ${allData.length} records, total count: ${totalCount}`);
        console.log(`Device IDs in database: ${JSON.stringify(deviceIds)}`);
        
        // Return diagnostic information
        res.json({
            status: "success",
            connectionInfo: {
                endpoint: endpoint ? (endpoint.substring(0, 15) + '...') : 'Not set',
                databaseId,
                containerId
            },
            totalRecords: totalCount,
            deviceIds,
            sampleData: allData.length > 0 ? allData[0] : null,
            data: allData
        });
    } catch (error) {
        console.error("❌ Diagnostic error:", error);
        res.status(500).json({
            status: "error",
            message: error.message,
            stack: error.stack
        });
    }
});

// Get latest telemetry entry for any device
router.get("/latest/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        console.log(`🔄 Fetching latest telemetry for device: ${deviceId}`);
        
        // Get any latest record from the database
        const database = client.database(databaseId);
        const container = database.container(containerId);
        
        // Try with any device first
        const latestQuery = {
            query: "SELECT TOP 1 * FROM c ORDER BY c._ts DESC"
        };
        
        const { resources: latestData } = await container.items.query(latestQuery).fetchAll();
        
        if (latestData.length === 0) {
            return res.json(null);
        }
        
        // Format data for frontend
        const latestEntry = {
            timestamp: new Date(latestData[0]._ts * 1000).toISOString(),
            temperature: latestData[0].temperature || latestData[0].temp || 0,
            humidity: latestData[0].humidity || latestData[0].humid || 0,
            oilLevel: latestData[0].oil_level || latestData[0].oilLevel || 0,
            openAlerts: latestData[0].open_alerts || latestData[0].alerts || 0
        };
        
        res.json(latestEntry);
    } catch (error) {
        console.error("❌ Error fetching latest telemetry:", error);
        res.json(null);
    }
});

// Get realtime telemetry data
router.get("/realtime/:deviceId", async (req, res) => {
    try {
        // Get the 20 most recent data points
        const database = client.database(databaseId);
        const container = database.container(containerId);
        
        const query = {
            query: "SELECT TOP 20 * FROM c ORDER BY c._ts DESC"
        };
        
        const { resources: recentData } = await container.items.query(query).fetchAll();
        
        if (recentData.length === 0) {
            return res.json([]);
        }
        
        // Format data for frontend
        const formattedData = recentData.map(data => ({
            timestamp: new Date(data._ts * 1000).toISOString(),
            temperature: data.temperature || data.temp || 0,
            humidity: data.humidity || data.humid || 0,
            oilLevel: data.oil_level || data.oilLevel || 0,
            openAlerts: data.open_alerts || data.alerts || 0
        }));
        
        // Sort by timestamp, oldest to newest for chart display
        formattedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching realtime data:", error);
        res.json([]);
    }
});

// Get historical telemetry data
router.get("/:deviceId", async (req, res) => {
    try {
        // Get the 20 most recent data points (same as realtime for now)
        const database = client.database(databaseId);
        const container = database.container(containerId);
        
        const query = {
            query: "SELECT TOP 20 * FROM c ORDER BY c._ts DESC"
        };
        
        const { resources: historicalData } = await container.items.query(query).fetchAll();
        
        if (historicalData.length === 0) {
            return res.json([]);
        }
        
        // Format data for frontend
        const formattedData = historicalData.map(data => ({
            timestamp: new Date(data._ts * 1000).toISOString(),
            temperature: data.temperature || data.temp || 0,
            humidity: data.humidity || data.humid || 0,
            oilLevel: data.oil_level || data.oilLevel || 0,
            openAlerts: data.open_alerts || data.alerts || 0
        }));
        
        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching historical data:", error);
        res.json([]);
    }
});

module.exports = router;