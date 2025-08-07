const { User } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { name, phone } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    // Check if current password is correct
    const isMatch = await user.isPasswordMatch(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin or self)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const user = await User.findByPk(id);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    // Check if user is authorized to delete
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw ApiError.forbidden('You are not authorized to delete this user');
    }
    
    await user.destroy();
    
    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['user', 'vendor', 'admin'];
    if (!validRoles.includes(role)) {
      throw ApiError.badRequest('Invalid role');
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
