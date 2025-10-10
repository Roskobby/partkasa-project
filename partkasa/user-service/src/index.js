require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const logger = require('./utils/logger');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8001;

// Apply global middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined', { stream: logger.stream })); // HTTP request logging

// Routes
app.use('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/auth', routes.authRoutes);
app.use('/users', routes.userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      // Connect to the database
      await sequelize.authenticate();
      logger.info('Database connection has been established successfully.');
      
      // Sync database models (in development)
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        logger.info('Database models synchronized.');
      }
      
      // Start listening for requests
      app.listen(PORT, () => {
        logger.info(`User service running on port ${PORT}`);
      });
      
      break; // If we reach here, connection is successful
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        logger.error('Unable to start server after multiple retries:', error);
        process.exit(1);
      }
      logger.warn(`Failed to connect to database. Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();

module.exports = app; // For testing
