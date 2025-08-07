const { Part } = require('../models');
const logger = require('../utils/logger');

/**
 * @desc    Create a new part
 * @route   POST /api/vendor/parts
 * @access  Private
 */
exports.createPart = async (req, res) => {
  try {
    const {
      name,
      partNumber,
      imageUrl,
      price,
      location,
      compatibleCars,
      deliveryETA,
      stockCount,
      description,
      specifications
    } = req.body;

    // Create part with vendor ID from authenticated vendor
    const part = await Part.create({
      name,
      partNumber,
      imageUrl,
      price,
      location,
      compatibleCars,
      deliveryETA,
      stockCount,
      description,
      specifications,
      vendorId: req.vendor.id
    });

    res.status(201).json({
      status: 'success',
      message: 'Part created successfully',
      data: {
        part
      }
    });
  } catch (error) {
    logger.error(`Error creating part: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error creating part'
    });
  }
};

/**
 * @desc    Get all parts for a vendor
 * @route   GET /api/vendor/parts
 * @access  Private
 */
exports.getVendorParts = async (req, res) => {
  try {
    const parts = await Part.findAll({
      where: { vendorId: req.vendor.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      count: parts.length,
      data: {
        parts
      }
    });
  } catch (error) {
    logger.error(`Error getting vendor parts: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error getting parts'
    });
  }
};

/**
 * @desc    Get a single part
 * @route   GET /api/vendor/parts/:id
 * @access  Private
 */
exports.getPart = async (req, res) => {
  try {
    const part = await Part.findOne({
      where: {
        id: req.params.id,
        vendorId: req.vendor.id
      }
    });

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Part not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        part
      }
    });
  } catch (error) {
    logger.error(`Error getting part: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error getting part'
    });
  }
};

/**
 * @desc    Update a part
 * @route   PUT /api/vendor/parts/:id
 * @access  Private
 */
exports.updatePart = async (req, res) => {
  try {
    const part = await Part.findOne({
      where: {
        id: req.params.id,
        vendorId: req.vendor.id
      }
    });

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Part not found'
      });
    }

    // Update part
    await part.update(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Part updated successfully',
      data: {
        part
      }
    });
  } catch (error) {
    logger.error(`Error updating part: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error updating part'
    });
  }
};

/**
 * @desc    Delete a part
 * @route   DELETE /api/vendor/parts/:id
 * @access  Private
 */
exports.deletePart = async (req, res) => {
  try {
    const part = await Part.findOne({
      where: {
        id: req.params.id,
        vendorId: req.vendor.id
      }
    });

    if (!part) {
      return res.status(404).json({
        status: 'error',
        message: 'Part not found'
      });
    }

    // Delete part
    await part.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Part deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting part: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting part'
    });
  }
};
