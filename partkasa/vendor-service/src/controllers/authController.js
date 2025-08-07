const { Vendor } = require('../models');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const crypto = require('crypto');

/**
 * @desc    Register a new vendor
 * @route   POST /api/vendor/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      businessName,
      businessRegistrationNumber
    } = req.body;

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ where: { email } });

    if (existingVendor) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already in use'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create vendor
    const vendor = await Vendor.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      country,
      postalCode,
      businessName,
      businessRegistrationNumber,
      verificationToken
    });

    // TODO: Send verification email

    // Generate token
    const token = generateToken(vendor);

    res.status(201).json({
      status: 'success',
      message: 'Vendor registered successfully',
      data: {
        vendor: vendor.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error(`Error registering vendor: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error registering vendor'
    });
  }
};

/**
 * @desc    Login vendor
 * @route   POST /api/vendor/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Find vendor by email
    const vendor = await Vendor.findOne({ where: { email } });

    // Check if vendor exists and password is correct
    if (!vendor || !(await vendor.isPasswordMatch(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    vendor.lastLogin = new Date();
    await vendor.save();

    // Generate token
    const token = generateToken(vendor);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        vendor: vendor.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error(`Error logging in vendor: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in'
    });
  }
};

/**
 * @desc    Get current vendor profile
 * @route   GET /api/vendor/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        vendor: req.vendor.toJSON()
      }
    });
  } catch (error) {
    logger.error(`Error getting vendor profile: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error getting profile'
    });
  }
};
