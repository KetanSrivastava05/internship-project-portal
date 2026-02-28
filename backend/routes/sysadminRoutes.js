const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    updateUserConfig,
    getAuditLogs
} = require('../controllers/sysadminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and for system_admin only
router.use(protect);
router.use(authorize('system_admin'));

router.get('/users', getAllUsers);
router.put('/users/:id', updateUserConfig);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
