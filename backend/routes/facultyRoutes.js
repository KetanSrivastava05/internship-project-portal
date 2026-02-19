const express = require('express');
const router = express.Router();
const {
    getFacultyList,
    requestMentorship,
    getMyRequests,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMyStudents,
    getMyStudentsReports
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route for students to see faculty list (or protected for students)
router.get('/list', protect, getFacultyList);

// Mentorship Routes
router.post('/request-mentorship', protect, authorize('student'), requestMentorship);
router.get('/my-requests', protect, authorize('student'), getMyRequests);
router.get('/requests', protect, authorize('faculty'), getMentorshipRequests);
router.put('/requests/:id', protect, authorize('faculty'), respondToMentorshipRequest);

// Faculty Dashboard Routes
router.get('/my-students', protect, authorize('faculty'), getMyStudents);
router.get('/student-reports', protect, authorize('faculty'), getMyStudentsReports);

module.exports = router;
