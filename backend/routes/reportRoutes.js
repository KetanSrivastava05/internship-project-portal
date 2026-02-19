const express = require('express');
const router = express.Router();
const {
    submitReport,
    getMyReports,
    getReports,
    reviewReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), submitReport);
router.get('/', protect, authorize('student'), getMyReports);
router.get('/internship/:internshipId', protect, getReports);
router.put('/:id/review', protect, authorize('faculty', 'company', 'external_mentor'), reviewReport);

module.exports = router;
