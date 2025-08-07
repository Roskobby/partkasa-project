const express = require('express');
const router = express.Router();

// Import route modules
const vendorRoutes = require('./vendorRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/vendors', vendorRoutes);
router.use('/health', healthRoutes);

module.exports = router;
