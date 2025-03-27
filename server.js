require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db"); // MongoDB
const { connectCosmosDB } = require("./config/CosmosDB"); // CosmosDB

const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const azureDevice = require('./routes/azureDevice');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to CosmosDB
connectCosmosDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/azure', azureDevice);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});