const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const partController = require('../controllers/partController');
const { protect, isVerified } = require('../middleware/auth');

// Auth routes (public)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.use(protect);

// Vendor profile
router.get('/me', authController.getMe);

// Parts management (require verification)
router.use(isVerified);

// Parts routes
router.route('/parts')
  .post(partController.createPart)
  .get(partController.getVendorParts);

router.route('/parts/:id')
  .get(partController.getPart)
  .put(partController.updatePart)
  .delete(partController.deletePart);

module.exports = router;
