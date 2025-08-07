const express = require('express');
const router = express.Router();

// Import route modules
const deliveryRoutes = require('./deliveryRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/deliveries', deliveryRoutes);
router.use('/health', healthRoutes);

module.exports = router;
