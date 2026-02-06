const WeeklyReport = require('../models/WeeklyReport');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Submit a weekly report
// @route   POST /api/reports
// @access  Private (Student only)
const submitReport = async (req, res) => {
    try {
        const { internshipId, weekNumber, content } = req.body;

        // Verify student is approved for this internship
        const application = await Application.findOne({
            internshipId,
            studentId: req.user._id,
            status: 'approved'
        });

        if (!application) {
            return res.status(403).json({ message: 'Not authorized. You do not have an approved internship.' });
        }

        const report = await WeeklyReport.create({
            internshipId,
            studentId: req.user._id,
            weekNumber,
            content,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get reports for an internship (Student/Mentor)
// @route   GET /api/reports/internship/:internshipId
// @access  Private
const getReports = async (req, res) => {
    try {
        const { internshipId } = req.params;

        // Logic to enforce who can see what
        // Student: Can see own.
        // Company/Faculty: Can see reports for their internships.

        let query = { internshipId };

        if (req.user.role === 'student') {
            query.studentId = req.user._id;
        }
        // Additional security checks for company/faculty usually go here to ensure they own the internship

        const reports = await WeeklyReport.find(query).sort({ weekNumber: 1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Review report (Mentor)
// @route   PUT /api/reports/:id/review
// @access  Private (Faculty/Company/External Mentor)
const reviewReport = async (req, res) => {
    try {
        const { comments, rating } = req.body;

        // In real app, verify mentor assignment here

        const report = await WeeklyReport.findByIdAndUpdate(
            req.params.id,
            {
                mentorFeedback: {
                    authorId: req.user._id,
                    comments,
                    rating,
                    givenAt: Date.now()
                },
                status: 'reviewed'
            },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { submitReport, getReports, reviewReport };
