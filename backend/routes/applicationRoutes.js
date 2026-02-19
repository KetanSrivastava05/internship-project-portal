const express = require('express');
const router = express.Router();
const {
    applyForInternship,
    getMyApplications,
    getInternshipApplications,
    updateApplicationStatus,
    submitFinalReport,
    getSubmissionsForEvaluator,
    evaluateApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), applyForInternship);
router.get('/my-applications', protect, authorize('student'), getMyApplications);
router.get('/internship/:internshipId', protect, authorize('company'), getInternshipApplications);
router.put('/:id/status', protect, authorize('company'), updateApplicationStatus);

// Evaluator routes
router.post('/submit-report/:id', protect, authorize('student'), submitFinalReport);
router.get('/evaluator/submissions', protect, authorize('evaluator'), getSubmissionsForEvaluator);
router.post('/evaluate/:id', protect, authorize('evaluator'), evaluateApplication);

module.exports = router;
