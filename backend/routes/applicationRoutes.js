const express = require('express');
const router = express.Router();
const {
    applyForInternship,
    getMyApplications,
    getInternshipApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), applyForInternship);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/internship/:internshipId', protect, authorize('company'), getInternshipApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

module.exports = router;
