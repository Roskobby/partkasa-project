const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo, isVerified } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes accessible to all authenticated users
router.get('/profile', userController.getUserById);
router.patch('/profile', userController.updateProfile);
router.patch('/change-password', userController.changePassword);

// Routes that require email verification
router.use(isVerified);

// Admin-only routes
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/role', userController.updateUserRole);

module.exports = router;
