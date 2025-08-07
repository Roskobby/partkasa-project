const Vendor = require('./Vendor');
const Part = require('./Part');
const { sequelize } = require('../config/database');

// Define associations
Vendor.hasMany(Part, { foreignKey: 'vendorId', as: 'parts' });
Part.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });

module.exports = {
  Vendor,
  Part,
  sequelize
};
