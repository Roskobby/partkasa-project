const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Payment service is running',
    timestamp: new Date().toISOString(),
    service: 'payment-service'
  });
});

module.exports = router;
