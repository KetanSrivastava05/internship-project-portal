const Evaluation = require('../models/Evaluation');
const Certificate = require('../models/Certificate');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Submit evaluation and generate grade
// @route   POST /api/evaluations
// @access  Private (Evaluator/Faculty only)
const submitEvaluation = async (req, res) => {
    try {
        const { internshipId, studentId, criteriaRatings, remarks, grade } = req.body;

        const evaluation = await Evaluation.create({
            internshipId,
            studentId,
            evaluatorId: req.user._id,
            criteriaRatings,
            remarks,
            grade,
            finalized: true
        });

        // Auto-generate Certificate if Passed (Assuming Grade != F)
        if (grade !== 'F') {
            await Certificate.create({
                internshipId,
                studentId
            });

            // Update Internship Status if needed? Actually Internship status is usually per batch, 
            // but Application status might need update to 'certified' or similar if tracking per student.
            // Updating Application status for tracking
            await Application.findOneAndUpdate(
                { internshipId, studentId },
                { status: 'certified' } // Adding 'certified' to enum or using 'approved' + certificate existence
            );
        }

        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get evaluation for a student
// @route   GET /api/evaluations/student/:studentId
// @access  Private
const getStudentEvaluation = async (req, res) => {
    try {
        const evaluation = await Evaluation.findOne({ studentId: req.params.studentId, internshipId: req.query.internshipId });
        if (!evaluation) {
            return res.status(404).json({ message: 'Evaluation not found' });
        }
        // Check access
        if (req.user.role === 'student' && req.user._id.toString() !== req.params.studentId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { submitEvaluation, getStudentEvaluation };
