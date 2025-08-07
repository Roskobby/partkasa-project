const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const deliveryController = require('../controllers/deliveryController');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   POST /api/deliveries/assign
 * @desc    Assign a delivery to the nearest available rider
 * @access  Private
 */
router.post('/assign', deliveryController.assignDelivery);

/**
 * @route   PATCH /api/deliveries/:id/status
 * @desc    Update delivery status
 * @access  Private
 */
router.patch('/:id/status', deliveryController.updateDeliveryStatus);

/**
 * @route   GET /api/deliveries/:id
 * @desc    Get delivery details by ID
 * @access  Private
 */
router.get('/:id', deliveryController.getDeliveryById);

/**
 * @route   GET /api/deliveries
 * @desc    Get all deliveries (with optional filters)
 * @access  Private
 */
router.get('/', deliveryController.getAllDeliveries);

module.exports = router;
