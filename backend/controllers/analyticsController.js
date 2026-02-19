const Internship = require('../models/Internship');
const Application = require('../models/Application');

// @desc    Get company dashboard stats
// @route   GET /api/analytics/company
// @access  Private (Company only)
const getCompanyStats = async (req, res) => {
    try {
        const companyId = req.user._id;

        // 1. Total Internships Posted
        const totalInternships = await Internship.countDocuments({ companyId });

        // 2. Active Internships (Open)
        const activeInternships = await Internship.countDocuments({ companyId, status: 'open' });

        // 3. Total Applications Received (for all internships by this company)
        // First find all internship IDs by this company
        const internships = await Internship.find({ companyId }).select('_id');
        const internshipIds = internships.map(i => i._id);

        const totalApplications = await Application.countDocuments({
            internshipId: { $in: internshipIds }
        });

        // 4. Hired Interns (Approved applications)
        const hiredInterns = await Application.countDocuments({
            internshipId: { $in: internshipIds },
            status: 'approved'
        });

        res.json({
            totalInternships,
            activeInternships,
            totalApplications,
            hiredInterns
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getCompanyStats
};
