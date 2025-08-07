const Order = require('../models/Order');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const axios = require('axios');

/**
 * Create a new order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { partId, quantity, shippingAddress } = req.body;
    const userId = req.user.id; // From JWT auth middleware

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      throw ApiError.badRequest('Valid shipping address is required');
    }

    // Get part details from search service
    const partResponse = await axios.get(`${process.env.SEARCH_SERVICE_URL}/api/search/parts/${partId}`);
    const part = partResponse.data.part;

    if (!part) {
      throw ApiError.notFound('Part not found');
    }

    if (!part.isAvailable || part.stock < quantity) {
      throw ApiError.badRequest('Part is not available in requested quantity');
    }

    // Calculate total amount
    const amount = parseFloat(part.price) * quantity;

    // Create order
    const order = await Order.create({
      userId,
      partId,
      vendorId: part.vendor.id,
      amount,
      quantity,
      shippingAddress,
      status: 'pending',
      metadata: {
        partName: part.name,
        partNumber: part.partNumber,
        vendorName: part.vendor.name,
        unitPrice: part.price
      }
    });

    // Notify vendor service about the order
    await axios.post(`${process.env.VENDOR_SERVICE_URL}/api/vendor/orders/notify`, {
      orderId: order.id,
      vendorId: part.vendor.id,
      partId: partId,
      quantity: quantity
    });

    res.status(201).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order history for a user
 */
exports.getOrderHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.findAndCountAll({
      where: query,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      status: 'success',
      results: orders.rows.length,
      pagination: {
        total: orders.count,
        page: parseInt(page),
        pages: Math.ceil(orders.count / parseInt(limit))
      },
      orders: orders.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    // Validate status transition
    const validTransitions = {
      pending: ['paid', 'cancelled'],
      paid: ['processing', 'refunded'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: []
    };

    if (!validTransitions[order.status].includes(status)) {
      throw ApiError.badRequest(`Invalid status transition from ${order.status} to ${status}`);
    }

    // Update order
    order.status = status;
    if (notes) {
      order.notes = notes;
    }
    await order.save();

    // Notify user about status change via notification service
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notify`, {
      type: 'ORDER_STATUS_UPDATE',
      userId: order.userId,
      data: {
        orderId: order.id,
        oldStatus: order.status,
        newStatus: status,
        notes
      }
    });

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get order details
 */
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId }
    });

    if (!order) {
      throw ApiError.notFound('Order not found');
    }

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};
