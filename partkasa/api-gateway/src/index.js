require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

// Import routes
const healthRoutes = require('./routes/health');
const { authMiddleware } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Apply global middleware
app.use(helmet()); // Security headers

// CORS allowlist via env API_CORS_ORIGINS (comma-separated)
const corsOrigins = (process.env.API_CORS_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (corsOrigins.length === 0 || corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
); // Enable CORS with allowlist
app.use(express.json()); // Parse JSON bodies
app.use(morgan('combined')); // HTTP request logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Request ID correlation: ensure x-request-id exists and is returned to client
app.use((req, res, next) => {
  let rid = req.headers['x-request-id'];
  if (!rid) {
    try {
      rid = crypto.randomUUID();
    } catch (e) {
      rid = Math.random().toString(36).slice(2);
    }
    req.headers['x-request-id'] = rid;
  }
  res.setHeader('x-request-id', rid);
  next();
});

// Health check routes (no auth required)
app.use('/health', healthRoutes);

// Service routes with authentication
// User Service
app.use(
  '/api/users',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/users': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Vendor Service
app.use(
  '/api/vendors',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.VENDOR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/vendors': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Search Service
app.use(
  '/api/search',
  createProxyMiddleware({
    target: process.env.SEARCH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/search': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Order Service
app.use(
  '/api/orders',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/orders': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Payment Service
app.use(
  '/api/payments',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/payments': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Delivery Service
app.use(
  '/api/delivery',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.DELIVERY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/delivery': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Notification Service (internal only)
app.use(
  '/api/notifications',
  authMiddleware,
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/notifications': '',
    },
    onProxyReq(proxyReq, req) {
      if (req.headers['x-request-id']) {
        proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
      }
    },
    onProxyRes(proxyRes, req, res) {
      const rid = req.headers['x-request-id'];
      if (rid) res.setHeader('x-request-id', rid);
    },
  })
);

// Auth routes (handled by User Service)
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/auth',
    },
  })
);

// Error handling middleware
app.use(errorHandler);

// Function to check if a service is healthy
const checkServiceHealth = async (serviceUrl) => {
  try {
    const response = await fetch(`${serviceUrl}/health`);
    return response.ok;
  } catch (error) {
    logger.error(`Health check failed for ${serviceUrl}: ${error.message}`);
    return false;
  }
};

// Function to check all services health with retries
const checkAllServicesHealth = async () => {
  const services = [
    { name: 'User Service', url: process.env.USER_SERVICE_URL },
    { name: 'Vendor Service', url: process.env.VENDOR_SERVICE_URL },
    { name: 'Search Service', url: process.env.SEARCH_SERVICE_URL },
    { name: 'Order Service', url: process.env.ORDER_SERVICE_URL },
    { name: 'Payment Service', url: process.env.PAYMENT_SERVICE_URL },
    { name: 'Delivery Service', url: process.env.DELIVERY_SERVICE_URL },
    { name: 'Notification Service', url: process.env.NOTIFICATION_SERVICE_URL }
  ];

  let retries = 10;
  let allHealthy = false;

  while (retries > 0 && !allHealthy) {
    logger.info(`Checking services health. Retries left: ${retries}`);
    
    const healthResults = await Promise.all(
      services.map(async (service) => {
        const isHealthy = await checkServiceHealth(service.url);
        return { ...service, isHealthy };
      })
    );

    const unhealthyServices = healthResults.filter(service => !service.isHealthy);
    
    if (unhealthyServices.length === 0) {
      allHealthy = true;
      logger.info('All services are healthy!');
    } else {
      retries--;
      if (retries === 0) {
        logger.error('Failed to connect to all services after multiple retries');
        unhealthyServices.forEach(service => {
          logger.error(`${service.name} is not healthy`);
        });
      } else {
        logger.warn(`Some services are not healthy. Waiting before retry...`);
        unhealthyServices.forEach(service => {
          logger.warn(`${service.name} is not healthy`);
        });
        // Wait for 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  return allHealthy;
};

// Start the server
const startServer = async () => {
  try {
    // Check if all services are healthy
    const allServicesHealthy = await checkAllServicesHealth();
    
    if (!allServicesHealthy) {
      logger.error('Not all services are healthy. API Gateway may not function correctly.');
    }
    
    // Start the server anyway, as services might become available later
    app.listen(PORT, () => {
      logger.info(`API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting API Gateway: ${error.message}`);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

module.exports = app; // For testing
