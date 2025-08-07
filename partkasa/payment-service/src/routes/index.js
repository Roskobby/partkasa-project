const express = require('express');
const router = express.Router();

// Import route modules
const paymentRoutes = require('./paymentRoutes');
const healthRoutes = require('./healthRoutes');

// Mount routes
router.use('/payments', paymentRoutes);
router.use('/health', healthRoutes);

module.exports = router;
