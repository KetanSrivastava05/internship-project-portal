const User = require('../models/User');
const Application = require('../models/Application');
const Internship = require('../models/Internship');

// @desc    Get placement analytics for TPO dashboard
// @route   GET /api/tpo/analytics
// @access  Private (TPO only)
const getAnalytics = async (req, res) => {
    try {
        console.log("Fetching total students...");
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'student' });
        console.log("Total students: ", totalStudents);

        // 2. Total Companies
        const totalCompanies = await User.countDocuments({ role: 'company' });

        // 3. Total Internships
        const totalInternships = await Internship.countDocuments({});

        // 4. Total Placed Students 
        // A student might have multiple applications, so we find distinct students who have an 'approved' application
        console.log("Fetching approved applications...");
        const approvedApplications = await Application.find({ status: 'approved' }).select('studentId');
        console.log(`Found ${approvedApplications.length} approved applications`);

        let totalPlacedStudents = 0;
        try {
            const uniquePlacedStudents = new Set(approvedApplications.map(app => app.studentId.toString()));
            totalPlacedStudents = uniquePlacedStudents.size;
            console.log("Calculated total placed students: ", totalPlacedStudents);
        } catch (mapErr) {
            console.error("Error calculating unique placed students", mapErr);
        }

        // 5. Active Internships
        const activeInternships = await Internship.countDocuments({ status: 'open' });

        res.json({
            totalStudents,
            totalCompanies,
            totalInternships,
            totalPlacedStudents,
            activeInternships
        });
    } catch (error) {
        console.error('TPO Analytics Error:', error);
        res.status(500).json({ message: 'Server Error fetching TPO analytics', error: error.message });
    }
};

// @desc    Get detailed placement report (list of placed students)
// @route   GET /api/tpo/reports
// @access  Private (TPO only)
const getPlacementReport = async (req, res) => {
    try {
        // Find all approved applications and populate student and internship (which includes company)
        const placements = await Application.find({ status: 'approved' })
            .populate('studentId', 'name email')
            .populate({
                path: 'internshipId',
                select: 'title companyId',
                populate: {
                    path: 'companyId',
                    select: 'name email profile', // Assuming Company name is stored in User model under 'name' or we might need CompanyProfile
                }
            })
            .sort({ updatedAt: -1 });

        // Format data for easier consumption on frontend
        const formattedReport = placements.map(app => {
            // Check if population was successful
            const studentName = app.studentId ? app.studentId.name : 'Unknown Student';
            const studentEmail = app.studentId ? app.studentId.email : 'Unknown Email';
            const internshipTitle = app.internshipId ? app.internshipId.title : 'Unknown Role';

            // Depending on how company data is stored: 
            // the 'internshipId.companyId' refers to User model for the company
            const companyName = (app.internshipId && app.internshipId.companyId) ? app.internshipId.companyId.name : 'Unknown Company';

            return {
                applicationId: app._id,
                studentName,
                studentEmail,
                companyName,
                role: internshipTitle,
                approvalDate: app.updatedAt
            };
        });

        res.json(formattedReport);
    } catch (error) {
        console.error('TPO Report Error:', error);
        res.status(500).json({ message: 'Server Error fetching placement report', error: error.message });
    }
};

module.exports = {
    getAnalytics,
    getPlacementReport
};
