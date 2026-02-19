const User = require('../models/User');
const FacultyProfile = require('../models/FacultyProfile');
const MentorshipRequest = require('../models/MentorshipRequest');
const StudentProfile = require('../models/StudentProfile');
const WeeklyReport = require('../models/WeeklyReport');

// @desc    Get list of all faculties
// @route   GET /api/faculty
// @access  Protected (Student/Admin)
const getFacultyList = async (req, res) => {
    try {
        const faculties = await User.aggregate([
            { $match: { role: 'faculty' } },
            {
                $lookup: {
                    from: 'facultyprofiles',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'profile'
                }
            },
            { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
            { $project: { passwordHash: 0, 'profile.createdAt': 0, 'profile.updatedAt': 0 } }
        ]);
        res.json(faculties);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Request mentorship (Legacy - kept for backward compatibility, but should use /api/mentorship/request)
// @route   POST /api/faculty/request-mentorship
// @access  Protected (Student)
const requestMentorship = async (req, res) => {
    try {
        const { facultyId, message } = req.body;

        const existingRequest = await MentorshipRequest.findOne({
            studentId: req.user._id,
            mentorId: facultyId,
            mentorType: 'faculty',
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request with this faculty.' });
        }

        // Check if already mentored
        const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
        if (studentProfile && studentProfile.mentorId) {
            return res.status(400).json({ message: 'You already have an assigned mentor.' });
        }

        const request = await MentorshipRequest.create({
            studentId: req.user._id,
            mentorId: facultyId,
            mentorType: 'faculty',
            message
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get requests sent by me (Student)
// @route   GET /api/faculty/my-requests
// @access  Protected (Student)
const getMyRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({ studentId: req.user._id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get mentorship requests for faculty
// @route   GET /api/faculty/requests
// @access  Protected (Faculty)
const getMentorshipRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({
            mentorId: req.user._id,
            mentorType: 'faculty',
            status: 'pending'
        })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Respond to mentorship request
// @route   PUT /api/faculty/requests/:id
// @access  Protected (Faculty)
const respondToMentorshipRequest = async (req, res) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'
        const request = await MentorshipRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.mentorId.toString() !== req.user._id.toString() || request.mentorType !== 'faculty') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        request.status = status;
        await request.save();

        if (status === 'accepted') {
            // Update Student Profile with mentorId in mentors array
            await StudentProfile.findOneAndUpdate(
                { userId: request.studentId },
                {
                    $push: {
                        mentors: {
                            mentorId: req.user._id,
                            mentorType: 'faculty'
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

// @desc    Get my mentored students
// @route   GET /api/faculty/my-students
// @access  Protected (Faculty)
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

// @desc    Get reports of my students
// @route   GET /api/faculty/student-reports
// @access  Protected (Faculty)
const getMyStudentsReports = async (req, res) => {
    try {
        // Find all student IDs mentored by this faculty
        const myStudents = await StudentProfile.find({
            $or: [
                { 'mentors.mentorId': req.user._id },
                { mentorId: req.user._id } // Backward compatibility
            ]
        }).select('userId');
        const studentIds = myStudents.map(s => s.userId);

        const reports = await WeeklyReport.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name email')
            .populate('internshipId', 'title')
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getFacultyList,
    requestMentorship,
    getMyRequests,
    getMentorshipRequests,
    respondToMentorshipRequest,
    getMyStudents,
    getMyStudentsReports
};
