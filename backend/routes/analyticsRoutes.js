const express = require('express');
const router = express.Router();
const { getCompanyStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/company', protect, authorize('company'), getCompanyStats);

module.exports = router;
