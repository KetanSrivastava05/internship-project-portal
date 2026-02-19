const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Apply for an internship
// @route   POST /api/applications
// @access  Private (Student only)
const applyForInternship = async (req, res) => {
    try {
        const { internshipId, resumeUrl, coverLetter } = req.body;

        // Check if internship exists and is open
        const internship = await Internship.findById(internshipId);
        if (!internship || internship.status !== 'open') {
            return res.status(400).json({ message: 'Internship not available' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            internshipId,
            studentId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this internship' });
        }

        const application = await Application.create({
            internshipId,
            studentId: req.user._id,
            resumeUrl,
            coverLetter
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get student's applications
// @route   GET /api/applications/my-applications
// @access  Private (Student only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.user._id })
            .populate('internshipId', 'title companyId')
            .populate('internshipId.companyId', 'companyName')
            .populate({
                path: 'projectId',
                select: 'title facultyId',
                populate: { path: 'facultyId', select: 'name' }
            })
            .sort({ appliedAt: -1 });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get applications for a company's internship
// @route   GET /api/applications/internship/:internshipId
// @access  Private (Company only)
const getInternshipApplications = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.internshipId);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check ownership
        if (internship.companyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ internshipId: req.params.internshipId })
            .populate('studentId', 'name email')
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Company only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('internshipId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check ownership via internship
        if (application.internshipId.companyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        // Validate workflow transition (simple check for now)
        const validTransitions = {
            'applied': ['shortlisted', 'rejected'],
            'shortlisted': ['interviewed', 'rejected'],
            'interviewed': ['approved', 'rejected'],
            'approved': [], // Terminal
            'rejected': []  // Terminal
        };

        // Strict Workflow Check
        if (!validTransitions[application.status].includes(status)) {
            return res.status(400).json({ message: `Invalid status transition from ${application.status} to ${status}` });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Submit final report
// @route   POST /api/applications/submit-report/:id
// @access  Private (Student only)
const submitFinalReport = async (req, res) => {
    try {
        const { finalReportUrl } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership
        if (application.studentId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (application.status !== 'approved') {
            return res.status(400).json({ message: 'Application must be approved before submitting report' });
        }

        application.finalReportUrl = finalReportUrl;
        application.status = 'submitted';
        application.submittedAt = Date.now();
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get submissions for evaluator
// @route   GET /api/applications/evaluator/submissions
// @access  Private (Evaluator only)
const getSubmissionsForEvaluator = async (req, res) => {
    try {
        // Fetch applications with status 'submitted' or 'graded'
        // For 'graded', we might only want those graded by this evaluator, or all?
        // Let's fetch all 'submitted' ones, and 'graded' ones graded by THIS evaluator.
        const applications = await Application.find({
            $or: [
                { status: 'submitted' },
                { status: 'graded', evaluatedBy: req.user._id }
            ]
        })
            .populate('studentId', 'name email')
            .populate('internshipId', 'title')
            .populate('projectId', 'title')
            .sort({ submittedAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Evaluate application (Grade)
// @route   POST /api/applications/evaluate/:id
// @access  Private (Evaluator only)
const evaluateApplication = async (req, res) => {
    try {
        const { grade, evaluationComments } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if report submitted
        if (!application.finalReportUrl) {
            return res.status(400).json({ message: 'No report submitted' });
        }

        // Strict status check? Allow regrading?
        // Let's allow regrading or grading 'submitted'
        if (application.status !== 'submitted' && application.status !== 'graded') {
            return res.status(400).json({ message: 'Application not ready for evaluation' });
        }

        application.grade = grade;
        application.evaluationComments = evaluationComments;
        application.evaluatedBy = req.user._id;
        application.status = 'graded';
        application.gradedAt = Date.now();

        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    applyForInternship,
    getMyApplications,
    getInternshipApplications,
    updateApplicationStatus,
    submitFinalReport,
    getSubmissionsForEvaluator,
    evaluateApplication
};
