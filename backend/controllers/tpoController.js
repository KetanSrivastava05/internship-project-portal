const User = require('../models/User');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const Project = require('../models/Project');
const CompanyProfile = require('../models/CompanyProfile');

// @desc    Get placement analytics for TPO dashboard
// @route   GET /api/tpo/analytics
// @access  Private (TPO only)
const getAnalytics = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // 2. Total Companies
        const totalCompanies = await User.countDocuments({ role: 'company' });

        // 3. Total Internships
        const totalInternships = await Internship.countDocuments({});

        // 4. Total Placed Students 
        const approvedApplications = await Application.find({ status: 'approved' }).select('studentId');
        const uniquePlacedStudents = new Set(approvedApplications.map(app => app.studentId.toString()));
        const totalPlacedStudents = uniquePlacedStudents.size;

        // 5. Active Internships
        const activeInternships = await Internship.countDocuments({ status: 'open' });

        // 6. Domain Statistics (Mapping Domains vs Placements)
        // Fetch all approved applications with their internship/project info
        const placements = await Application.find({ status: 'approved' })
            .populate({
                path: 'internshipId',
                select: 'companyId',
                populate: { path: 'companyId', select: '_id' }
            })
            .populate({
                path: 'projectId',
                select: 'domain'
            });

        const domainCounts = {};

        for (const app of placements) {
            let domain = 'Other';
            if (app.internshipId && app.internshipId.companyId) {
                const companyProfile = await CompanyProfile.findOne({ userId: app.internshipId.companyId._id });
                if (companyProfile && companyProfile.domain) {
                    domain = companyProfile.domain;
                }
            } else if (app.projectId && app.projectId.domain) {
                domain = app.projectId.domain;
            }
            
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        }

        const domainStats = Object.keys(domainCounts).map(domain => ({
            name: domain,
            placements: domainCounts[domain]
        })).sort((a, b) => b.placements - a.placements);

        res.json({
            totalStudents,
            totalCompanies,
            totalInternships,
            totalPlacedStudents,
            activeInternships,
            domainStats
        });
    } catch (error) {
        console.error('TPO Analytics Error:', error);
        res.status(500).json({ message: 'Server Error fetching TPO analytics', error: error.message });
    }
};

// @desc    Get detailed technical report (everything: internships and projects)
// @route   GET /api/tpo/reports
// @access  Private (TPO only)
const getPlacementReport = async (req, res) => {
    try {
        // 1. Fetch Internships and their applications
        const internships = await Internship.find()
            .populate('companyId', 'name email')
            .sort({ createdAt: -1 });

        const internshipData = await Promise.all(internships.map(async (inst) => {
            const approvedApps = await Application.find({ internshipId: inst._id, status: 'approved' })
                .populate('studentId', 'name email');
            
            if (approvedApps.length > 0) {
                return approvedApps.map(app => ({
                    type: 'Internship',
                    title: inst.title,
                    provider: inst.companyId ? inst.companyId.name : 'Unknown Company',
                    status: 'Filled',
                    studentName: app.studentId ? app.studentId.name : 'N/A',
                    studentEmail: app.studentId ? app.studentId.email : 'N/A',
                    date: app.updatedAt
                }));
            } else {
                return [{
                    type: 'Internship',
                    title: inst.title,
                    provider: inst.companyId ? inst.companyId.name : 'Unknown Company',
                    status: inst.status === 'open' ? 'Open' : 'Closed (Unfilled)',
                    studentName: 'N/A',
                    studentEmail: 'N/A',
                    date: inst.updatedAt
                }];
            }
        }));

        // 2. Fetch Projects and their applications
        const projects = await Project.find()
            .populate('facultyId', 'name email')
            .sort({ createdAt: -1 });

        const projectData = await Promise.all(projects.map(async (proj) => {
            const approvedApps = await Application.find({ projectId: proj._id, status: 'approved' })
                .populate('studentId', 'name email');
            
            if (approvedApps.length > 0) {
                return approvedApps.map(app => ({
                    type: 'Project',
                    title: proj.title,
                    provider: proj.facultyId ? proj.facultyId.name : 'Unknown Faculty',
                    status: 'Filled',
                    studentName: app.studentId ? app.studentId.name : 'N/A',
                    studentEmail: app.studentId ? app.studentId.email : 'N/A',
                    date: app.updatedAt
                }));
            } else {
                return [{
                    type: 'Project',
                    title: proj.title,
                    provider: proj.facultyId ? proj.facultyId.name : 'Unknown Faculty',
                    status: proj.status === 'open' ? 'Open' : 'Closed (Unfilled)',
                    studentName: 'N/A',
                    studentEmail: 'N/A',
                    date: proj.updatedAt
                }];
            }
        }));

        // Flatten and combine
        const flatInternships = internshipData.flat();
        const flatProjects = projectData.flat();
        
        res.json([...flatInternships, ...flatProjects]);
    } catch (error) {
        console.error('TPO Report Error:', error);
        res.status(500).json({ message: 'Server Error fetching placement report', error: error.message });
    }
};

module.exports = {
    getAnalytics,
    getPlacementReport
};
