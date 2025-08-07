const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Delivery = sequelize.define('Delivery', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  riderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Riders',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
    defaultValue: 'pending'
  },
  pickupLocation: {
    type: DataTypes.JSON,
    allowNull: false
  },
  deliveryLocation: {
    type: DataTypes.JSON,
    allowNull: false
  },
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actualDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  customerContact: {
    type: DataTypes.JSON,
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['orderId']
    },
    {
      fields: ['riderId', 'status']
    },
    {
      fields: ['trackingNumber']
    }
  ]
});

// Define association
Delivery.belongsTo(sequelize.models.Rider, { as: 'rider', foreignKey: 'riderId' });

module.exports = Delivery;
