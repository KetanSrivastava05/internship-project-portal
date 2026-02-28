const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const FacultyProfile = require('../models/FacultyProfile');
const ExternalMentorProfile = require('../models/ExternalMentorProfile');
const EvaluatorProfile = require('../models/EvaluatorProfile');
const CollegeAdminProfile = require('../models/CollegeAdminProfile');
const TPOProfile = require('../models/TPOProfile');
const SystemAdminProfile = require('../models/SystemAdminProfile');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-passwordHash');

        let profile = null;
        if (user.role === 'student') {
            profile = await StudentProfile.findOne({ userId: user._id })
                .populate('mentorId', 'name email') // Keep for backward compatibility
                .populate('mentors.mentorId', 'name email role');
        } else if (user.role === 'company') {
            profile = await CompanyProfile.findOne({ userId: user._id });
        } else if (user.role === 'faculty') {
            profile = await FacultyProfile.findOne({ userId: user._id });
        } else if (user.role === 'external_mentor') {
            profile = await ExternalMentorProfile.findOne({ userId: user._id });
        } else if (user.role === 'evaluator') {
            profile = await EvaluatorProfile.findOne({ userId: user._id });
        } else if (user.role === 'college_admin') {
            profile = await CollegeAdminProfile.findOne({ userId: user._id });
        } else if (user.role === 'tpo') {
            profile = await TPOProfile.findOne({ userId: user._id });
        } else if (user.role === 'system_admin') {
            profile = await SystemAdminProfile.findOne({ userId: user._id });
        }

        res.json({ user, profile });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                // Password update logic would go here (hashing needed)
                // For now, let's skip password update to keep it simple or implement if needed
            }

            const updatedUser = await user.save();

            let updatedProfile = null;

            if (user.role === 'student') {
                const profileFields = {
                    education: req.body.education,
                    skills: req.body.skills ? req.body.skills.split(',').map(s => s.trim()) : undefined,
                    resumeUrl: req.body.resumeUrl,
                    portfolioUrl: req.body.portfolioUrl,
                    githubUrl: req.body.githubUrl,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await StudentProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'company') {
                const profileFields = {
                    companyName: req.body.companyName, // Usually same as user.name but specific to profile
                    website: req.body.website,
                    domain: req.body.domain,
                    description: req.body.description,
                    location: req.body.location
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await CompanyProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'faculty') {
                const profileFields = {
                    department: req.body.department,
                    designation: req.body.designation,
                    employeeId: req.body.employeeId,
                    subjectSpecialization: req.body.subjectSpecialization ? req.body.subjectSpecialization.split(',').map(s => s.trim()) : undefined,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await FacultyProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'external_mentor') {
                const profileFields = {
                    companyName: req.body.companyName,
                    designation: req.body.designation,
                    domain: req.body.domain,
                    experience: req.body.experience ? parseInt(req.body.experience) : undefined,
                    linkedinUrl: req.body.linkedinUrl,
                    location: req.body.location,
                    expertise: req.body.expertise ? req.body.expertise.split(',').map(s => s.trim()) : undefined,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await ExternalMentorProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'evaluator') {
                const profileFields = {
                    department: req.body.department,
                    designation: req.body.designation,
                    expertise: req.body.expertise ? req.body.expertise.split(',').map(s => s.trim()) : undefined,
                    experience: req.body.experience ? parseInt(req.body.experience) : undefined,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await EvaluatorProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'college_admin') {
                const profileFields = {
                    department: req.body.department,
                    designation: req.body.designation,
                    phone: req.body.phone,
                    officeLocation: req.body.officeLocation,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await CollegeAdminProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'tpo') {
                const profileFields = {
                    designation: req.body.designation,
                    phone: req.body.phone,
                    officeLocation: req.body.officeLocation,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await TPOProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            } else if (user.role === 'system_admin') {
                const profileFields = {
                    department: req.body.department,
                    designation: req.body.designation,
                    phone: req.body.phone,
                    officeLocation: req.body.officeLocation,
                    about: req.body.about
                };

                // Remove undefined fields
                Object.keys(profileFields).forEach(key => profileFields[key] === undefined && delete profileFields[key]);

                updatedProfile = await SystemAdminProfile.findOneAndUpdate(
                    { userId: user._id },
                    { $set: profileFields },
                    { new: true, upsert: true, setDefaultsOnInsert: true }
                );
            }

            res.json({
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                },
                profile: updatedProfile
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
