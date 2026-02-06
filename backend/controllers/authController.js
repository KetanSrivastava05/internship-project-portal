const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken, clearToken } = require('../utils/authUtils');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, ...profileData } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            passwordHash,
            role
        });

        if (user) {
            // Create role-specific profile if needed
            if (role === 'student') {
                const { degree, institution, startYear, resumeUrl } = profileData;
                // Basic validation for student profile
                if (!resumeUrl || !degree) {
                    // Should ideally rollback user creation here or validate before
                }
                await StudentProfile.create({
                    userId: user._id,
                    education: { degree: degree || 'N/A', institution: institution || 'N/A', startYear: startYear || new Date().getFullYear() },
                    resumeUrl: resumeUrl || 'pending_upload'
                });
            } else if (role === 'company') {
                const { companyName, domain } = profileData;
                await CompanyProfile.create({
                    userId: user._id,
                    companyName: companyName || name,
                    domain: domain || 'General',
                });
            }

            generateToken(res, user._id, user.role);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            generateToken(res, user._id, user.role);

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    clearToken(res);
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
};
