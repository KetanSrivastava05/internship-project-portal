const express = require('express');
const router = express.Router();
const {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getMyInternships
} = require('../controllers/internshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getInternships);
router.get('/my-internships', protect, authorize('company'), getMyInternships);
router.get('/:id', getInternshipById);
router.post('/', protect, authorize('company'), createInternship);
router.put('/:id', protect, authorize('company'), updateInternship);
router.delete('/:id', protect, authorize('company'), deleteInternship);

module.exports = router;
