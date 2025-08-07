const { sequelize } = require('../config/database');
const User = require('./User');

// Define model relationships here if needed
// For example:
// User.hasMany(Address);
// Address.belongsTo(User);

module.exports = {
  sequelize,
  User
};
