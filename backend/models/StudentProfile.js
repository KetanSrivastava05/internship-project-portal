const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    // Deprecated: supporting multiple mentors now
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    mentors: [{
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        mentorType: { type: String, enum: ['faculty', 'external_mentor'] },
        assignedAt: { type: Date, default: Date.now }
    }],
    education: {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        startYear: { type: Number, required: true },
        endYear: { type: Number },
        cgpa: { type: Number }
    },
    skills: [{
        type: String,
        trim: true
    }],
    resumeUrl: {
        type: String,
        required: true
    },
    portfolioUrl: String,
    githubUrl: String,
    about: String
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
