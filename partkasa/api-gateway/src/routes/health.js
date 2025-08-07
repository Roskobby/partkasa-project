const express = require('express');
const router = express.Router();
const axios = require('axios');

// Simple health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Detailed health check that checks all services
router.get('/detailed', async (req, res) => {
  const services = [
    { name: 'user-service', url: process.env.USER_SERVICE_URL },
    { name: 'vendor-service', url: process.env.VENDOR_SERVICE_URL },
    { name: 'search-service', url: process.env.SEARCH_SERVICE_URL },
    { name: 'order-service', url: process.env.ORDER_SERVICE_URL },
    { name: 'payment-service', url: process.env.PAYMENT_SERVICE_URL },
    { name: 'delivery-service', url: process.env.DELIVERY_SERVICE_URL },
    { name: 'notification-service', url: process.env.NOTIFICATION_SERVICE_URL }
  ];

  const healthChecks = await Promise.allSettled(
    services.map(async (service) => {
      try {
        const response = await axios.get(`${service.url}/health`, { timeout: 5000 });
        return {
          name: service.name,
          status: response.status === 200 ? 'up' : 'down',
          responseTime: response.headers['x-response-time'] || 'unknown'
        };
      } catch (error) {
        return {
          name: service.name,
          status: 'down',
          error: error.message
        };
      }
    })
  );

  const results = healthChecks.map((check, index) => {
    if (check.status === 'fulfilled') {
      return check.value;
    }
    return {
      name: services[index].name,
      status: 'down',
      error: 'Failed to check service health'
    };
  });

  const allServicesUp = results.every(result => result.status === 'up');

  res.status(allServicesUp ? 200 : 503).json({
    status: allServicesUp ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: results
  });
});

module.exports = router;
