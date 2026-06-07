const express = require('express');
const router = express.Router();
const { getDashboardStats, triggerParsing } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

router.post('/parse', protect, authorize('admin'), triggerParsing);

module.exports = router;