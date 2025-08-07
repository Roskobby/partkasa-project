const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Search routes
router.get('/parts', searchController.searchParts);
router.get('/parts/vehicle', searchController.searchPartsByVehicle);
router.get('/parts/:id', searchController.getPartById);

// Vehicle data routes
router.get('/vehicles/makes', searchController.getVehicleMakes);
router.get('/vehicles/makes/:make/models', searchController.getVehicleModels);
router.get('/vehicles/makes/:make/models/:model/years', searchController.getVehicleYears);

// Category and filter routes
router.get('/categories', searchController.getPartCategories);
router.get('/categories/:category/subcategories', searchController.getPartSubcategories);
router.get('/brands', searchController.getPartBrands);

module.exports = router;
