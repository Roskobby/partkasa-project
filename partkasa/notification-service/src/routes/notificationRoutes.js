const express = require('express');
const { notify } = require('../controllers/notificationController');
const router = express.Router();

/**
 * @route   POST /api/notify
 * @desc    Send notifications through configured channels
 * @access  Private
 * @body    {
 *   type: string,
 *   recipients: {
 *     whatsapp: string[],
 *     telegram: string[],
 *     email: string[]
 *   },
 *   data: object
 * }
 */
router.post('/', notify);

module.exports = router;
