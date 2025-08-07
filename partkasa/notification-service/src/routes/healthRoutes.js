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
    message: 'Notification service is running',
    timestamp: new Date().toISOString(),
    service: 'notification-service'
  });
});

module.exports = router;
