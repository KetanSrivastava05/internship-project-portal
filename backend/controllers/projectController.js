const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Protected (Faculty)
const createProject = async (req, res) => {
    try {
        const { title, description, technologies, domain, duration, maxStudents } = req.body;

        const project = await Project.create({
            facultyId: req.user._id,
            title,
            description,
            technologies: technologies.split(',').map(tech => tech.trim()),
            domain,
            duration,
            maxStudents
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all open projects
// @route   GET /api/projects
// @access  Protected (Student/Faculty/Admin)
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ status: 'open' })
            .populate('facultyId', 'name email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get my posted projects (Faculty)
// @route   GET /api/projects/my-projects
// @access  Protected (Faculty)
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({ facultyId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error in getMyProjects:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Protected (Faculty)
const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Verify ownership
        if (project.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { title, description, technologies, domain, duration, maxStudents, status } = req.body;

        project.title = title || project.title;
        project.description = description || project.description;
        if (technologies) {
            project.technologies = technologies.split(',').map(tech => tech.trim());
        }
        project.domain = domain || project.domain;
        project.duration = duration || project.duration;
        project.maxStudents = maxStudents || project.maxStudents;
        project.status = status || project.status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Protected (Faculty)
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Verify ownership
        if (project.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await project.deleteOne();
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const Application = require('../models/Application');

// ... (previous imports and methods)

// @desc    Apply for a project
// @route   POST /api/projects/:id/apply
// @access  Protected (Student)
const applyForProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.status === 'closed') {
            return res.status(400).json({ message: 'Project is closed' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            projectId: req.params.id,
            studentId: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this project' });
        }

        // Check if Resume is provided (assume user profile has resumeUrl, or pass in body)
        // For simplicity, we might assume user profile has it, or require it in body.
        // Let's check user profile for now or basic requirement.
        const StudentProfile = require('../models/StudentProfile');
        const studentProfile = await StudentProfile.findOne({ userId: req.user._id });

        if (!studentProfile || !studentProfile.resumeUrl) {
            // Alternatively, allow passing resumeUrl in body
            if (!req.body.resumeUrl) {
                return res.status(400).json({ message: 'Please upload your resume in your profile or provide a link.' });
            }
        }

        const resumeUrl = req.body.resumeUrl || studentProfile.resumeUrl;


        const application = await Application.create({
            projectId: req.params.id,
            studentId: req.user._id,
            resumeUrl: resumeUrl,
            status: 'applied'
        });

        res.status(201).json(application);
    } catch (error) {
        console.error('Error in applyForProject:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get applications for a project
// @route   GET /api/projects/:id/applications
// @access  Protected (Faculty)
const getProjectApplications = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Verify ownership
        if (project.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ projectId: req.params.id })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/projects/applications/:id/status
// @access  Protected (Faculty)
const updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('projectId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify ownership via project
        if (application.projectId.facultyId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { status } = req.body;
        if (!['shortlisted', 'interviewed', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createProject,
    getProjects,
    getMyProjects,
    updateProject,
    deleteProject,
    applyForProject,
    getProjectApplications,
    updateApplicationStatus
};
