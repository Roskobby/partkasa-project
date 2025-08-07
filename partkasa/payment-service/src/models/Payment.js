const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    index: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'GHS', // Ghana Cedis
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'processing', 'success', 'failed', 'refunded'],
    defaultValue: 'pending'
  },
  provider: {
    type: DataTypes.ENUM,
    values: ['paystack', 'momo'],
    defaultValue: 'paystack'
  },
  providerReference: {
    type: DataTypes.STRING,
    unique: true
  },
  paymentMethod: {
    type: DataTypes.STRING // card, bank_transfer, mobile_money
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['orderId', 'status']
    },
    {
      fields: ['providerReference'],
      unique: true
    }
  ]
});

module.exports = Payment;
