const whatsappService = require('../services/whatsappService');
const telegramService = require('../services/telegramService');
const emailService = require('../services/emailService');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const NOTIFICATION_TEMPLATES = {
  ORDER_CREATED: {
    subject: 'Order Confirmation - PartKasa.com',
    template: (data) => ({
      message: `Your order #${data.orderId} has been confirmed. Track your order at: ${data.trackingUrl}`
    })
  },
  ORDER_UPDATED: {
    subject: 'Order Status Update - PartKasa.com',
    template: (data) => ({
      message: `Your order #${data.orderId} status has been updated to: ${data.status}`
    })
  },
  DELIVERY_ASSIGNED: {
    subject: 'Delivery Assigned - PartKasa.com',
    template: (data) => ({
      message: `Your order #${data.orderId} has been assigned to ${data.riderName}. Track your delivery with number: ${data.trackingNumber}`
    })
  },
  DELIVERY_STATUS_UPDATE: {
    subject: 'Delivery Status Update - PartKasa.com',
    template: (data) => ({
      message: `Your delivery #${data.trackingNumber} status has been updated to: ${data.newStatus}`
    })
  },
  PAYMENT_RECEIVED: {
    subject: 'Payment Confirmation - PartKasa.com',
    template: (data) => ({
      message: `We've received your payment of ${data.amount} for order #${data.orderId}. Thank you for shopping with PartKasa!`
    })
  }
};

/**
 * Send notification through configured channels
 */
exports.notify = async (req, res, next) => {
  try {
    const { type, recipients, data } = req.body;

    if (!type || !recipients || !data) {
      throw ApiError.badRequest('Missing required fields');
    }

    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) {
      throw ApiError.badRequest('Invalid notification type');
    }

    const { message } = template.template(data);
    const subject = template.subject;

    const results = {
      whatsapp: [],
      telegram: [],
      email: []
    };

    // Send notifications in parallel
    const notifications = [];

    // WhatsApp notifications
    if (recipients.whatsapp && recipients.whatsapp.length > 0) {
      notifications.push(
        ...recipients.whatsapp.map(async (phone) => {
          const result = await whatsappService.sendMessage(phone, message);
          results.whatsapp.push({ phone, ...result });
        })
      );
    }

    // Telegram notifications
    if (recipients.telegram && recipients.telegram.length > 0) {
      notifications.push(
        ...recipients.telegram.map(async (chatId) => {
          const result = await telegramService.sendMessage(chatId, message);
          results.telegram.push({ chatId, ...result });
        })
      );
    }

    // Email notifications
    if (recipients.email && recipients.email.length > 0) {
      notifications.push(
        ...recipients.email.map(async (email) => {
          const result = await emailService.sendEmail(email, subject, message);
          results.email.push({ email, ...result });
        })
      );
    }

    // Wait for all notifications to be sent
    await Promise.all(notifications);

    // Log notification results
    logger.info('Notifications sent', {
      type,
      results
    });

    res.status(200).json({
      status: 'success',
      message: 'Notifications sent',
      results
    });
  } catch (error) {
    next(error);
  }
};
