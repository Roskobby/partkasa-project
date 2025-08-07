const jwt = require('jsonwebtoken');
const { Vendor } = require('../models');
const logger = require('../utils/logger');

/**
 * Middleware to protect routes that require authentication
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if vendor still exists
      const vendor = await Vendor.findByPk(decoded.id);

      if (!vendor) {
        return res.status(401).json({
          status: 'error',
          message: 'The vendor belonging to this token no longer exists'
        });
      }

      // Add vendor to request object
      req.vendor = vendor;
      next();
    } catch (error) {
      logger.error(`JWT verification error: ${error.message}`);
      return res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

/**
 * Middleware to check if vendor's email is verified
 */
exports.isVerified = (req, res, next) => {
  if (!req.vendor.isVerified) {
    return res.status(403).json({
      status: 'error',
      message: 'Please verify your email address before accessing this resource'
    });
  }
  next();
};

/**
 * Generate JWT token for vendor
 */
exports.generateToken = (vendor) => {
  return jwt.sign(
    { id: vendor.id, email: vendor.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d'
    }
  );
};
