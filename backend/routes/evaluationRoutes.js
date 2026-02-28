const express = require('express');
const router = express.Router();
const {
    submitEvaluation,
    getStudentEvaluation
} = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('evaluator', 'faculty'), submitEvaluation);
router.get('/student/:studentId', protect, authorize('evaluator', 'faculty', 'college_admin', 'student'), getStudentEvaluation);

module.exports = router;
