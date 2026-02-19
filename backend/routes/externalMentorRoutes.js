const express = require('express');
const router = express.Router();
const {
    getAssignedStudents,
    getStudentReports,
    provideFeedback,
    getExternalMentorList,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMyStudents
} = require('../controllers/externalMentorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for students to see external mentor list
router.get('/list', protect, getExternalMentorList);

// Mentorship Routes
router.get('/requests', protect, authorize('external_mentor'), getMentorshipRequests);
router.put('/requests/:id', protect, authorize('external_mentor'), respondToMentorshipRequest);
router.get('/my-students', protect, authorize('external_mentor'), getMyStudents);

// Dashboard Routes
router.get('/students', protect, authorize('external_mentor'), getAssignedStudents);
router.get('/reports', protect, authorize('external_mentor'), getStudentReports);
router.put('/reports/:id/feedback', protect, authorize('external_mentor'), provideFeedback);

module.exports = router;
