const express = require('express');
const router = express.Router();

/**
 * Health check endpoint
 * @route GET /api/health
 * @returns {Object} 200 - Health status
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: 'search-service',
    message: 'Service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
