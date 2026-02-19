const Application = require('../models/Application');
const WeeklyReport = require('../models/WeeklyReport');
const Internship = require('../models/Internship');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const ExternalMentorProfile = require('../models/ExternalMentorProfile');

// @desc    Get assigned students (students who have accepted this external mentor)
// @route   GET /api/external-mentor/students
// @access  Private (External Mentor)
const getAssignedStudents = async (req, res) => {
    try {
        // Get students who have this external mentor assigned
        const studentProfiles = await StudentProfile.find({
            $or: [
                { 'mentors.mentorId': req.user._id },
                { mentorId: req.user._id } // Backward compatibility
            ]
        })
            .populate('userId', 'name email');

        // Get their approved internships
        const studentIds = studentProfiles.map(sp => sp.userId._id);
        const approvedApplications = await Application.find({
            studentId: { $in: studentIds },
            status: 'approved'
        })
            .populate('internshipId', 'title companyId')
            .populate('internshipId.companyId', 'name');

        // Map students with their internships
        const studentsMap = new Map();
        studentProfiles.forEach(sp => {
            const studentId = sp.userId._id.toString();
            studentsMap.set(studentId, {
                studentId: sp.userId,
                internships: []
            });
        });

        approvedApplications.forEach(app => {
            if (app.studentId && app.internshipId) {
                const studentId = app.studentId.toString();
                if (studentsMap.has(studentId)) {
                    studentsMap.get(studentId).internships.push({
                        internshipId: app.internshipId,
                        applicationId: app._id
                    });
                }
            }
        });

        const students = Array.from(studentsMap.values());
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get reports for assigned students
// @route   GET /api/external-mentor/reports
// @access  Private (External Mentor)
const getStudentReports = async (req, res) => {
    try {
        // Get students who have this external mentor assigned
        const studentProfiles = await StudentProfile.find({
            $or: [
                { 'mentors.mentorId': req.user._id },
                { mentorId: req.user._id } // Backward compatibility
            ]
        });
        const studentIds = studentProfiles.map(sp => sp.userId);

        const reports = await WeeklyReport.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name email')
            .populate('internshipId', 'title')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Provide technical feedback on a report
// @route   PUT /api/external-mentor/reports/:id/feedback
// @access  Private (External Mentor)
const provideFeedback = async (req, res) => {
    try {
        const { comments, rating } = req.body;
        const reportId = req.params.id;

        // Check if report exists and student has approved internship
        const report = await WeeklyReport.findById(reportId).populate('studentId');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        // Verify student is assigned to this external mentor
        const studentProfile = await StudentProfile.findOne({
            userId: report.studentId._id,
            $or: [
                { 'mentors.mentorId': req.user._id },
                { mentorId: req.user._id } // Backward compatibility
            ]
        });

        if (!studentProfile) {
            return res.status(403).json({ message: 'Student is not assigned to you as a mentor' });
        }

        // Add external mentor feedback (we'll store it separately or in a new field)
        // For now, we'll add it to mentorFeedback but mark it as external
        report.mentorFeedback = {
            authorId: req.user._id,
            comments: comments,
            rating: rating,
            givenAt: Date.now(),
            type: 'external' // Mark as external mentor feedback
        };
        report.status = 'reviewed';
        await report.save();

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get list of all external mentors
// @route   GET /api/external-mentor/list
// @access  Protected (Student)
const getExternalMentorList = async (req, res) => {
    try {
        const mentors = await User.aggregate([
            { $match: { role: 'external_mentor' } },
            {
                $lookup: {
                    from: 'externalmentorprofiles',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'profile'
                }
            },
            { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
            { $project: { passwordHash: 0, 'profile.createdAt': 0, 'profile.updatedAt': 0 } }
        ]);
        res.json(mentors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get mentorship requests for external mentor
// @route   GET /api/external-mentor/requests
// @access  Protected (External Mentor)
const getMentorshipRequests = async (req, res) => {
    try {
        const MentorshipRequest = require('../models/MentorshipRequest');
        const requests = await MentorshipRequest.find({
            mentorId: req.user._id,
            mentorType: 'external_mentor',
            status: 'pending'
        })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Respond to mentorship request (External Mentor)
// @route   PUT /api/external-mentor/requests/:id
// @access  Protected (External Mentor)
const respondToMentorshipRequest = async (req, res) => {
    try {
        const MentorshipRequest = require('../models/MentorshipRequest');
        const { status } = req.body; // 'accepted' or 'rejected'
        const request = await MentorshipRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.mentorId.toString() !== req.user._id.toString() || request.mentorType !== 'external_mentor') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        if (status === 'accepted') {
            // Update Student Profile with mentorId
            await StudentProfile.findOneAndUpdate(
                { userId: request.studentId },
                {
                    $push: {
                        mentors: {
                            mentorId: req.user._id,
                            mentorType: 'external_mentor'
                        }
                    }
                },
                { upsert: true }
            );

            // No longer rejecting other pending requests automatically
        }

        res.json({ message: `Request ${status}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get my mentored students (External Mentor)
// @route   GET /api/external-mentor/my-students
// @access  Protected (External Mentor)
const getMyStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find({
            $or: [
                { 'mentors.mentorId': req.user._id },
                { mentorId: req.user._id } // Backward compatibility
            ]
        })
            .populate('userId', 'name email');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAssignedStudents,
    getStudentReports,
    provideFeedback,
    getExternalMentorList,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMyStudents
};
