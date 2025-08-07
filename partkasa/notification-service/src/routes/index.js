const express = require('express');
const router = express.Router();

// Import route modules
const notificationRoutes = require('./notificationRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/notifications', notificationRoutes);
router.use('/health', healthRoutes);

module.exports = router;
