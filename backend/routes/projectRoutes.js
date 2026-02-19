const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createProject,
    getProjects,
    getMyProjects,
    updateProject,
    deleteProject,
    applyForProject,
    getProjectApplications,
    updateApplicationStatus
} = require('../controllers/projectController');

// Faculty specific routes (Place these before generic/root routes if potential conflicts exist, though explicit paths usually are safe)
router.get('/my-projects', protect, authorize('faculty'), getMyProjects);
router.post('/', protect, authorize('faculty'), createProject);
router.put('/:id', protect, authorize('faculty'), updateProject);
router.delete('/:id', protect, authorize('faculty'), deleteProject);
router.get('/:id/applications', protect, authorize('faculty'), getProjectApplications);
router.put('/applications/:id/status', protect, authorize('faculty'), updateApplicationStatus);

// Public/Shared routes (protected)
router.get('/', protect, getProjects);
router.post('/:id/apply', protect, authorize('student'), applyForProject);

module.exports = router;
