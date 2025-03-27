const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

// CosmosDB connection settings
const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;
const databaseId = process.env.COSMOSDB_DATABASE;
const containerId = process.env.COSMOSDB_CONTAINER;

const client = new CosmosClient({ endpoint, key });

let container; // Global variable to store container reference

// ✅ Function to connect to CosmosDB
async function connectCosmosDB() {
  try {
    const { database } = await client.databases.createIfNotExists({ id: databaseId });
    const { container: createdContainer } = await database.containers.createIfNotExists({ id: containerId });

    container = createdContainer; // Store reference for future queries

    console.log(`Connected to CosmosDB: ${databaseId} -> Container: ${containerId}`);
  } catch (error) {
    console.error(" Error connecting to CosmosDB:", error.message);
    process.exit(1);
  }
}

// ✅ Function to fetch real-time telemetry data
const getTelemetryData = async () => {
  try {
    if (!container) {
      console.error("Container is not initialized. Ensure connectCosmosDB() is called first.");
      return [];
    }
    const { resources } = await container.items.readAll().fetchAll();
    return resources;
  } catch (error) {
    console.error("❌ Error Fetching Telemetry Data:", error.message);
    return [];
  }
};

module.exports = { connectCosmosDB, getTelemetryData };