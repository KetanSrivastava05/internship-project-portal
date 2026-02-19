const Internship = require('../models/Internship');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Project = require('../models/Project'); // Assuming Project model exists for reports
const Application = require('../models/Application'); // Assuming Application model exists for reports
const mongoose = require('mongoose');

// @desc    Get pending internships
// @route   GET /api/admin/internships/pending
// @access  Private/CollegeAdmin
const getPendingInternships = async (req, res) => {
    try {
        const internships = await Internship.find({
            academicApprovalStatus: 'pending',
            status: 'open' // Only show open internships needing approval? Or all? Let's show all pending.
        }).populate('companyId', 'name email');
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Approve/Reject internship
// @route   PUT /api/admin/internships/:id/approve
// @access  Private/CollegeAdmin
const approveInternship = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        internship.academicApprovalStatus = status;
        await internship.save();

        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all students for mentor assignment
// @route   GET /api/admin/students
// @access  Private/CollegeAdmin
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('name email');

        // Fetch profiles to get current mentor info
        const studentProfiles = await StudentProfile.find({ userId: { $in: students.map(s => s._id) } })
            .populate('mentors.mentorId', 'name email');

        // Merge data
        const data = students.map(student => {
            const profile = studentProfiles.find(p => p.userId.toString() === student._id.toString());
            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                mentors: profile ? profile.mentors : []
            };
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Assign faculty mentor to student
// @route   POST /api/admin/assign-mentor
// @access  Private/CollegeAdmin
const assignFacultyMentor = async (req, res) => {
    try {
        const { studentId, mentorId } = req.body; // mentorId is the User ObjectId of the faculty

        const studentProfile = await StudentProfile.findOne({ userId: studentId });
        if (!studentProfile) {
            // Create profile if doesn't exist? Ideally should exist.
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Check if mentor is already assigned
        const isAssigned = studentProfile.mentors.some(m => m.mentorId.toString() === mentorId);
        if (isAssigned) {
            return res.status(400).json({ message: 'Mentor already assigned' });
        }

        // Add mentor
        studentProfile.mentors.push({
            mentorId: mentorId,
            mentorType: 'faculty', // Enforce faculty type for admin assignment
            assignedAt: Date.now()
        });

        await studentProfile.save();
        res.json({ message: 'Mentor assigned successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get system reports
// @route   GET /api/admin/reports
// @access  Private/CollegeAdmin
const getSystemReports = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await User.countDocuments({ role: 'company' });
        const totalFaculty = await User.countDocuments({ role: 'faculty' });

        const activeInternships = await Internship.countDocuments({ status: 'open' });
        const pendingApprovals = await Internship.countDocuments({ academicApprovalStatus: 'pending' });

        const totalApplications = await Application.countDocuments();

        // Simple placement stat: students with at least one approved application
        const placedStudents = await Application.estimatedDocumentCount(); // Approximate or expensive aggregation

        res.json({
            users: {
                students: totalStudents,
                companies: totalCompanies,
                faculty: totalFaculty
            },
            internships: {
                active: activeInternships,
                pending: pendingApprovals
            },
            applications: {
                total: totalApplications
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all faculty members
// @route   GET /api/admin/faculty
// @access  Private/CollegeAdmin
const getAllFaculty = async (req, res) => {
    try {
        const faculty = await User.find({ role: 'faculty' }).select('name email');
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get users by role
// @route   GET /api/admin/users
// @access  Private/CollegeAdmin
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        const query = role ? { role } : {};
        const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/CollegeAdmin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getPendingInternships,
    approveInternship,
    getAllStudents,
    assignFacultyMentor,
    getSystemReports,
    getAllFaculty,
    getUsersByRole,
    updateUserStatus
};
