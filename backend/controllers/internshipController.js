const Internship = require('../models/Internship');
const CompanyProfile = require('../models/CompanyProfile');

// @desc    Get all internships (public/student view)
// @route   GET /api/internships
// @access  Public
const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ status: 'open' })
            .populate('companyId', 'name')
            .sort({ createdAt: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
const getInternshipById = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id).populate('companyId', 'name email');
        if (internship) {
            res.json(internship);
        } else {
            res.status(404).json({ message: 'Internship not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Company only)
const createInternship = async (req, res) => {
    try {
        const {
            title,
            description,
            skillsRequired,
            eligibilityCriteria,
            stipend,
            duration,
            location,
            deadline
        } = req.body;

        const internship = await Internship.create({
            companyId: req.user._id,
            title,
            description,
            skillsRequired,
            eligibilityCriteria,
            stipend,
            duration,
            location,
            deadline
        });

        res.status(201).json(internship);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Company only)
const updateInternship = async (req, res) => {
    try {
        let internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check ownership
        if (internship.companyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this internship' });
        }

        internship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(internship);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Company only)
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findById(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Internship not found' });
        }

        // Check ownership
        if (internship.companyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this internship' });
        }

        await Internship.deleteOne({ _id: req.params.id });
        res.json({ message: 'Internship removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get internships by company
// @route   GET /api/internships/my-internships
// @access  Private (Company only)
const getMyInternships = async (req, res) => {
    try {
        const internships = await Internship.find({ companyId: req.user._id }).sort({ createdAt: -1 });
        res.json(internships);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getInternships,
    getInternshipById,
    createInternship,
    updateInternship,
    deleteInternship,
    getMyInternships
};
