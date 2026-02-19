const express = require('express');
const router = express.Router();
const {
    getPendingInternships,
    approveInternship,
    getAllStudents,
    assignFacultyMentor,
    getSystemReports,
    getAllFaculty,
    getUsersByRole,
    updateUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and for college_admin only
router.use(protect);
router.use(authorize('college_admin'));

router.get('/internships/pending', getPendingInternships);
router.put('/internships/:id/approve', approveInternship);
router.get('/students', getAllStudents);
router.post('/assign-mentor', assignFacultyMentor);
router.get('/reports', getSystemReports);
router.get('/faculty', getAllFaculty);
router.get('/users', getUsersByRole);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
