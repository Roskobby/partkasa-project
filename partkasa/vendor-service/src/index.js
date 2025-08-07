require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'vendor-service' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  let retries = 5;
  while (retries) {
    try {
      // Connect to database and sync models
      await sequelize.authenticate();
      logger.info('Database connection established successfully.');
      
      // Sync models
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      logger.info('Database models synchronized successfully.');
      
      // Start listening
      app.listen(PORT, () => {
        logger.info(`Vendor service running on port ${PORT}`);
      });
      
      break; // If we reach here, connection is successful
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        logger.error(`Error starting server after multiple retries: ${error.message}`);
        process.exit(1);
      }
      logger.warn(`Failed to connect to database. Retries left: ${retries}`);
      // Wait for 5 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});
