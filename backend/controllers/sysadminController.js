const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Helper to log sysadmin actions
const logSysadminAction = async (adminId, action, targetEntity, targetId, details) => {
    try {
        await AuditLog.create({
            userId: adminId,
            action,
            targetEntity,
            targetId,
            details
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};

// @desc    Get all users
// @route   GET /api/sysadmin/users
// @access  Private/SystemAdmin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.role) query.role = req.query.role;
        if (req.query.status) query.status = req.query.status;
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            users,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user configuration (role or status)
// @route   PUT /api/sysadmin/users/:id
// @access  Private/SystemAdmin
const updateUserConfig = async (req, res) => {
    try {
        const { role, status } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent a sysadmin from demoting themselves to avoid lockout, unless there are multiple
        if (user._id.toString() === req.user._id.toString() && role && role !== 'system_admin') {
            return res.status(400).json({ message: 'Cannot demote your own system admin account.' });
        }

        const updates = {};
        const oldValues = {};

        if (role && role !== user.role) {
            oldValues.role = user.role;
            user.role = role;
            updates.newRole = role;
        }

        if (status && status !== user.status) {
            oldValues.status = user.status;
            user.status = status;
            updates.newStatus = status;
        }

        if (Object.keys(updates).length > 0) {
            const updatedUser = await user.save();

            // Log the action
            await logSysadminAction(
                req.user._id,
                'UPDATE_USER_CONFIG',
                'User',
                updatedUser._id,
                { old: oldValues, new: updates }
            );

            res.json({
                message: 'User updated successfully',
                user: { _id: updatedUser._id, name: updatedUser.name, role: updatedUser.role, status: updatedUser.status }
            });
        } else {
            res.json({ message: 'No changes made.', user });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all audit logs
// @route   GET /api/sysadmin/audit-logs
// @access  Private/SystemAdmin
const getAuditLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.action) query.action = req.query.action;
        if (req.query.entity) query.targetEntity = req.query.entity;

        const logs = await AuditLog.find(query)
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AuditLog.countDocuments(query);

        res.json({
            logs,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    updateUserConfig,
    getAuditLogs
};
