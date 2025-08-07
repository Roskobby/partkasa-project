const express = require('express');
const router = express.Router();

// Import route modules
const orderRoutes = require('./orderRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/orders', orderRoutes);
router.use('/health', healthRoutes);

module.exports = router;
