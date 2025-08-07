const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true
  },
  partId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    defaultValue: 'pending'
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  estimatedDeliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      fields: ['userId', 'status']
    },
    {
      fields: ['vendorId', 'status']
    }
  ]
});

module.exports = Order;
