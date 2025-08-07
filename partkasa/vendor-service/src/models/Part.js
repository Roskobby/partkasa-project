const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Part = sequelize.define('Part', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  partNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  compatibleCars: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: []
  },
  deliveryETA: {
    type: DataTypes.INTEGER, // In days
    allowNull: false
  },
  stockCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specifications: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Vendors',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

module.exports = Part;
