const express = require('express');
const router = express.Router();
const {
    requestMentorship,
    getMyRequests
} = require('../controllers/mentorshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/request', protect, authorize('student'), requestMentorship);
router.get('/my-requests', protect, authorize('student'), getMyRequests);

module.exports = router;
