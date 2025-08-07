const { Delivery, Rider } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const axios = require('axios');
const { sequelize } = require('../config/database');
const { generateTrackingNumber } = require('../utils/helpers');

/**
 * Assign delivery to a rider
 */
exports.assignDelivery = async (req, res, next) => {
  try {
    const { orderId, pickupLocation, deliveryLocation, customerContact } = req.body;

    if (!orderId || !pickupLocation || !deliveryLocation || !customerContact) {
      throw ApiError.badRequest('Missing required fields');
    }

    // Find available rider closest to pickup location
    const availableRider = await Rider.findOne({
      where: {
        status: 'available',
        isActive: true
      },
      order: [
        [
          sequelize.literal(
            `ST_Distance(
              currentLocation,
              ST_SetSRID(ST_MakePoint(${pickupLocation.longitude}, ${pickupLocation.latitude}), 4326)
            )`
          ),
          'ASC'
        ]
      ]
    });

    if (!availableRider) {
      throw ApiError.notFound('No available riders found');
    }

    // Calculate ETA based on distance and average speed
    const estimatedDeliveryTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // Mock: 2 hours from now

    // Create delivery
    const delivery = await Delivery.create({
      orderId,
      riderId: availableRider.id,
      status: 'assigned',
      pickupLocation,
      deliveryLocation,
      estimatedDeliveryTime,
      customerContact,
      trackingNumber: generateTrackingNumber(),
    });

    // Update rider status
    await availableRider.update({ status: 'busy' });

    // Notify order service
    await axios.patch(`${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}/status`, {
      status: 'out_for_delivery',
      deliveryId: delivery.id
    });

    // Notify customer via notification service
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notify`, {
      type: 'DELIVERY_ASSIGNED',
      orderId,
      data: {
        deliveryId: delivery.id,
        trackingNumber: delivery.trackingNumber,
        riderName: availableRider.name,
        riderPhone: availableRider.phone,
        estimatedDeliveryTime: delivery.estimatedDeliveryTime
      }
    });

    res.status(200).json({
      status: 'success',
      delivery: {
        ...delivery.toJSON(),
        rider: availableRider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update delivery status
 */
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const delivery = await Delivery.findByPk(id, {
      include: [{ model: Rider, as: 'rider' }]
    });

    if (!delivery) {
      throw ApiError.notFound('Delivery not found');
    }

    // Validate status transition
    const validTransitions = {
      pending: ['assigned'],
      assigned: ['picked_up'],
      picked_up: ['in_transit'],
      in_transit: ['delivered', 'failed'],
      delivered: [],
      failed: []
    };

    if (!validTransitions[delivery.status].includes(status)) {
      throw ApiError.badRequest(`Invalid status transition from ${delivery.status} to ${status}`);
    }

    // Update delivery
    await delivery.update({
      status,
      notes: notes || delivery.notes,
      actualDeliveryTime: status === 'delivered' ? new Date() : delivery.actualDeliveryTime
    });

    // Update rider status if delivery is completed or failed
    if (status === 'delivered' || status === 'failed') {
      await delivery.rider.update({
        status: 'available',
        deliveriesCompleted: delivery.rider.deliveriesCompleted + (status === 'delivered' ? 1 : 0)
      });
    }

    // Notify order service
    const orderStatus = {
      delivered: 'delivered',
      failed: 'delivery_failed'
    }[status];

    if (orderStatus) {
      await axios.patch(`${process.env.ORDER_SERVICE_URL}/api/orders/${delivery.orderId}/status`, {
        status: orderStatus
      });
    }

    // Notify customer
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/api/notify`, {
      type: 'DELIVERY_STATUS_UPDATE',
      orderId: delivery.orderId,
      data: {
        deliveryId: delivery.id,
        trackingNumber: delivery.trackingNumber,
        oldStatus: delivery.status,
        newStatus: status,
        notes
      }
    });

    res.status(200).json({
      status: 'success',
      delivery: {
        ...delivery.toJSON(),
        rider: delivery.rider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get delivery by ID
 */
exports.getDeliveryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [{ model: Rider, as: 'rider' }]
    });

    if (!delivery) {
      throw ApiError.notFound('Delivery not found');
    }

    res.status(200).json({
      status: 'success',
      delivery: {
        ...delivery.toJSON(),
        rider: delivery.rider
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all deliveries with optional filters
 */
exports.getAllDeliveries = async (req, res, next) => {
  try {
    const { status, riderId, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (riderId) where.riderId = riderId;

    const offset = (page - 1) * limit;

    const deliveries = await Delivery.findAndCountAll({
      where,
      include: [{ model: Rider, as: 'rider' }],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        deliveries: deliveries.rows,
        total: deliveries.count,
        totalPages: Math.ceil(deliveries.count / limit),
        currentPage: parseInt(page)
      }
    });
  } catch (error) {
    next(error);
  }
};
