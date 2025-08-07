const Payment = require('../models/Payment');
const paystackService = require('../services/paystack.service');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * Initialize a payment
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { orderId, amount, email } = req.body;

    if (!orderId || !amount || !email) {
      throw ApiError.badRequest('Order ID, amount and email are required');
    }

    // Create payment record
    const payment = await Payment.create({
      orderId,
      amount,
      status: 'pending',
      provider: 'paystack',
      metadata: { email }
    });

    // Initialize transaction with Paystack
    const paymentData = {
      amount,
      email,
      reference: payment.id,
      callbackUrl: `${process.env.PAYMENT_SERVICE_URL}/api/payment/webhook`,
      metadata: {
        orderId,
        paymentId: payment.id
      }
    };

    const paystackResponse = await paystackService.initializeTransaction(paymentData);

    // Update payment with provider reference
    await payment.update({
      providerReference: paystackResponse.data.reference,
      metadata: {
        ...payment.metadata,
        authorizationUrl: paystackResponse.data.authorization_url,
        accessCode: paystackResponse.data.access_code
      }
    });

    res.status(200).json({
      status: 'success',
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        authorizationUrl: paystackResponse.data.authorization_url
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle payment webhook
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const event = req.body;
    const reference = event.data.reference;

    // Verify the transaction with Paystack
    const verificationResponse = await paystackService.verifyTransaction(reference);
    
    if (!verificationResponse.status) {
      throw ApiError.badRequest('Invalid transaction');
    }

    // Find the payment
    const payment = await Payment.findOne({
      where: { providerReference: reference }
    });

    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    // Update payment status based on verification
    const transactionStatus = verificationResponse.data.status;
    let paymentStatus;

    switch (transactionStatus.toLowerCase()) {
      case 'success':
        paymentStatus = 'success';
        break;
      case 'failed':
        paymentStatus = 'failed';
        break;
      default:
        paymentStatus = 'processing';
    }

    await payment.update({
      status: paymentStatus,
      metadata: {
        ...payment.metadata,
        paymentChannel: verificationResponse.data.channel,
        paidAt: verificationResponse.data.paid_at,
        gatewayResponse: verificationResponse.data.gateway_response
      }
    });

    // If payment is successful, update order status
    if (paymentStatus === 'success') {
      await axios.patch(
        `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.orderId}/status`,
        { status: 'paid' }
      );

      // Notify user about successful payment
      await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notify`,
        {
          type: 'PAYMENT_SUCCESS',
          orderId: payment.orderId,
          data: {
            amount: payment.amount,
            reference: payment.providerReference
          }
        }
      );
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment by ID
 */
exports.getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    res.status(200).json({
      status: 'success',
      payment
    });
  } catch (error) {
    next(error);
  }
};
