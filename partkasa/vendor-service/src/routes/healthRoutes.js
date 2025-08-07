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
    message: 'Vendor service is running',
    timestamp: new Date().toISOString(),
    service: 'vendor-service'
  });
});

module.exports = router;
