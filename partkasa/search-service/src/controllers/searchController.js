const { Part, Vehicle, Vendor } = require('../models');
const { ApiError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');
const nhtsaService = require('../services/nhtsa.service');
const cacheService = require('../services/cache.service');

/**
 * Search for parts by text query
 */
exports.searchParts = async (req, res, next) => {
  try {
    const { query, page = 1, limit = 20, sort = 'relevance', category, minPrice, maxPrice, brand } = req.query;
    
    // Build search criteria
    const searchCriteria = {};
    
    // Text search if query is provided
    if (query) {
      searchCriteria.$text = { $search: query };
    }
    
    // Filter by category if provided
    if (category) {
      searchCriteria.category = category;
    }
    
    // Filter by brand if provided
    if (brand) {
      searchCriteria.brand = brand;
    }
    
    // Filter by price range if provided
    if (minPrice || maxPrice) {
      searchCriteria.price = {};
      if (minPrice) searchCriteria.price.$gte = Number(minPrice);
      if (maxPrice) searchCriteria.price.$lte = Number(maxPrice);
    }
    
    // Only show available parts
    searchCriteria.isAvailable = true;
    searchCriteria.stock = { $gt: 0 };
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'relevance':
      default:
        // If text search is used, sort by text score
        if (query) {
          sortOptions = { score: { $meta: 'textScore' } };
        } else {
          sortOptions = { createdAt: -1 };
        }
    }
    
    // Execute search query with projection
    const parts = await Part.find(
      searchCriteria,
      query ? { score: { $meta: 'textScore' } } : null
    )
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .populate('vendor', 'name logo rating');
    
    // Get total count for pagination
    const total = await Part.countDocuments(searchCriteria);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / Number(limit));
    
    res.status(200).json({
      status: 'success',
      results: parts.length,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      },
      parts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search for parts by vehicle compatibility
 */
exports.searchPartsByVehicle = async (req, res, next) => {
  try {
    const { make, model, year, category, page = 1, limit = 20, sort = 'relevance' } = req.query;
    
    // Validate required parameters
    if (!make || !model || !year) {
      throw ApiError.badRequest('Make, model, and year are required');
    }
    
    // Validate vehicle exists in NHTSA database
    const vehicleValid = await nhtsaService.validateVehicle(make, model, year);
    if (!vehicleValid) {
      throw ApiError.badRequest('Invalid vehicle combination');
    }
    
    // Build search criteria
    const searchCriteria = {
      'compatibleVehicles': {
        $elemMatch: {
          make: make,
          model: model,
          year: Number(year)
        }
      },
      isAvailable: true,
      stock: { $gt: 0 }
    };
    
    // Filter by category if provided
    if (category) {
      searchCriteria.category = category;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'price_asc':
        sortOptions = { price: 1 };
        break;
      case 'price_desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'relevance':
      default:
        sortOptions = { createdAt: -1 };
    }
    
    // Execute search query
    const parts = await Part.find(searchCriteria)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .populate('vendor', 'name logo rating');
    
    // Get total count for pagination
    const total = await Part.countDocuments(searchCriteria);
    
    // Calculate total pages
    const totalPages = Math.ceil(total / Number(limit));
    
    res.status(200).json({
      status: 'success',
      results: parts.length,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      },
      parts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get part details by ID
 */
exports.getPartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const part = await Part.findById(id)
      .populate('vendor', 'name logo rating contactEmail contactPhone address businessHours');
    
    if (!part) {
      throw ApiError.notFound('Part not found');
    }
    
    res.status(200).json({
      status: 'success',
      part
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vehicle makes
 */
exports.getVehicleMakes = async (req, res, next) => {
  try {
    // Try to get from cache first
    const cacheKey = cacheService.generateKey('makes');
    let makes = await cacheService.get(cacheKey);
    
    if (!makes) {
      // Get from NHTSA API and store in cache
      makes = await nhtsaService.getMakes();
      await cacheService.set(cacheKey, makes, 86400); // Cache for 24 hours
      
      // Also update our database
      for (const make of makes) {
        await Vehicle.findOneAndUpdate(
          { make },
          { make },
          { upsert: true }
        );
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: makes.length,
      makes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vehicle models by make
 */
exports.getVehicleModels = async (req, res, next) => {
  try {
    const { make } = req.params;
    const { year } = req.query;
    
    if (!make) {
      throw ApiError.badRequest('Make is required');
    }
    
    // Try to get from cache first
    const cacheKey = cacheService.generateKey('models', make, year || 'all');
    let models = await cacheService.get(cacheKey);
    
    if (!models) {
      // Get from NHTSA API and store in cache
      models = await nhtsaService.getModels(make, year || new Date().getFullYear());
      await cacheService.set(cacheKey, models, 86400); // Cache for 24 hours
      
      // Update our database
      for (const model of models) {
        await Vehicle.findOneAndUpdate(
          { make, model },
          { make, model },
          { upsert: true }
        );
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: models.length,
      models
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get vehicle years by make and model
 */
exports.getVehicleYears = async (req, res, next) => {
  try {
    const { make, model } = req.params;
    
    if (!make || !model) {
      throw ApiError.badRequest('Make and model are required');
    }
    
    // Try to get from cache first
    const cacheKey = cacheService.generateKey('years', make, model);
    let years = await cacheService.get(cacheKey);
    
    if (!years) {
      // Get from NHTSA API and store in cache
      years = await nhtsaService.getYears(make, model);
      await cacheService.set(cacheKey, years, 86400); // Cache for 24 hours
      
      // Update our database
      for (const year of years) {
        await Vehicle.findOneAndUpdate(
          { make, model, year },
          { make, model, year },
          { upsert: true }
        );
      }
    }
    
    res.status(200).json({
      status: 'success',
      results: years.length,
      years
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get part categories
 */
exports.getPartCategories = async (req, res, next) => {
  try {
    const categories = await Part.distinct('category');
    
    res.status(200).json({
      status: 'success',
      results: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get part subcategories by category
 */
exports.getPartSubcategories = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    if (!category) {
      throw ApiError.badRequest('Category is required');
    }
    
    const subcategories = await Part.distinct('subcategory', { category });
    
    res.status(200).json({
      status: 'success',
      results: subcategories.length,
      subcategories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get part brands
 */
exports.getPartBrands = async (req, res, next) => {
  try {
    const brands = await Part.distinct('brand');
    
    res.status(200).json({
      status: 'success',
      results: brands.length,
      brands
    });
  } catch (error) {
    next(error);
  }
};
