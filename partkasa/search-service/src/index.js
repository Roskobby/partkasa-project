require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const connectDB = require('./config/database');
const { searchRoutes, healthRoutes } = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Set port
const PORT = process.env.PORT || 8002;

// Connect to MongoDB and setup indexes
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await connectDB();
      
      // Create necessary indexes
      const { Part, Vehicle } = require('./models');
      
      // Ensure text indexes for parts search
      await Part.collection.createIndex({
        name: 'text',
        description: 'text',
        partNumber: 'text',
        brand: 'text',
        'compatibleVehicles.make': 'text',
        'compatibleVehicles.model': 'text'
      }, {
        weights: {
          partNumber: 10,
          name: 5,
          brand: 3,
          'compatibleVehicles.make': 2,
          'compatibleVehicles.model': 2
        },
        name: 'parts_search_index'
      });

      // Ensure vehicle compatibility index
      await Vehicle.collection.createIndex(
        { make: 1, model: 1, year: 1 },
        { unique: true }
      );

      // Start cleanup scheduler
      const CleanupUtil = require('./utils/cleanup');
      CleanupUtil.scheduleCleanup();
      
      break; // If we reach here, connection is successful
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        logger.error(`Failed to connect to MongoDB after multiple retries: ${error.message}`);
        process.exit(1);
      }
      logger.warn(`Failed to connect to MongoDB. Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

connectWithRetry();

// Add request ID to each request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: logger.stream })); // HTTP request logging

// Routes
app.use('/api/search', searchRoutes);
// Health at both /health and /api/health for gateway checks
app.use('/health', healthRoutes);
app.use('/api/health', healthRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Search service running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
