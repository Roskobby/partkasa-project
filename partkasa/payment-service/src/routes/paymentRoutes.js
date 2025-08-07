const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');
const router = express.Router();

// Initialize payment (requires authentication)
router.post('/initiate', authMiddleware, paymentController.initiatePayment);

// Webhook endpoint (public, verified by Paystack signature)
router.post('/webhook', paymentController.handleWebhook);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, paymentController.getPaymentById);

/**
 * @route   POST /api/payments/refund
 * @desc    Process a refund
 * @access  Private
 */
router.post('/refund', (req, res) => {
  // This is a placeholder. In a real implementation, this would process a refund through a payment gateway
  const { transactionId, amount, reason } = req.body;
  
  // Validate request
  if (!transactionId || !amount) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }
  
  // Process refund (mock)
  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: {
      refundId: `ref_${Date.now()}`,
      transactionId,
      amount,
      reason: reason || 'Customer request',
      status: 'completed',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
