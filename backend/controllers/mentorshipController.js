const MentorshipRequest = require('../models/MentorshipRequest');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Request mentorship (unified for both faculty and external mentors)
// @route   POST /api/mentorship/request
// @access  Protected (Student)
const requestMentorship = async (req, res) => {
    try {
        const { mentorId, mentorType, message } = req.body;

        // Validate mentor type
        if (!['faculty', 'external_mentor'].includes(mentorType)) {
            return res.status(400).json({ message: 'Invalid mentor type' });
        }

        // Verify mentor exists and has correct role
        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== mentorType) {
            return res.status(400).json({ message: 'Invalid mentor' });
        }

        // Check for existing pending request
        const existingRequest = await MentorshipRequest.findOne({
            studentId: req.user._id,
            mentorId,
            mentorType,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending request with this mentor.' });
        }

        // Check if THIS mentor is already assigned
        const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
        if (studentProfile) {
            // Check in new mentors array
            if (studentProfile.mentors && studentProfile.mentors.some(m => m.mentorId.toString() === mentorId)) {
                return res.status(400).json({ message: 'You already have this mentor assigned.' });
            }
            // Check in legacy mentorId field (just in case)
            if (studentProfile.mentorId && studentProfile.mentorId.toString() === mentorId) {
                return res.status(400).json({ message: 'You already have this mentor assigned.' });
            }
        }

        const request = await MentorshipRequest.create({
            studentId: req.user._id,
            mentorId,
            mentorType,
            message
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all mentorship requests sent by student
// @route   GET /api/mentorship/my-requests
// @access  Protected (Student)
const getMyRequests = async (req, res) => {
    try {
        const requests = await MentorshipRequest.find({ studentId: req.user._id })
            .populate('mentorId', 'name email role')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    requestMentorship,
    getMyRequests
};
