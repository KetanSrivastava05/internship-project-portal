const express = require('express');
const router = express.Router();
const { getAnalytics, getPlacementReport } = require('../controllers/tpoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All TPO routes require authentication and 'tpo' role
router.use(protect);
router.use(authorize('tpo'));

router.get('/analytics', getAnalytics);
router.get('/reports', getPlacementReport);

module.exports = router;
