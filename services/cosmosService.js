const getTelemetryData = async (deviceId) => {
    try {
      if (!container) {
        console.error("❌ Container not initialized. Call connectCosmosDB() first.");
        return [];
      }
  
      // Get the current timestamp minus 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
      // Fetch only telemetry data from the last 5 minutes
      const querySpec = {
        query: "SELECT * FROM c WHERE c.deviceId = @deviceId AND c.timestamp >= @recentTime ORDER BY c.timestamp DESC",
        parameters: [
          { name: "@deviceId", value: deviceId },
          { name: "@recentTime", value: fiveMinutesAgo }
        ],
      };
  
      const { resources } = await container.items.query(querySpec).fetchAll();
      return resources;
    } catch (error) {
      console.error("❌ Error Fetching Telemetry Data:", error.message);
      return [];
    }
  };