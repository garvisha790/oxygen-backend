require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

// Set the port from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.log('❌ MongoDB connection error: ', err));
