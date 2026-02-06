const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    coverLetter: String,
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'interviewed', 'approved', 'rejected'],
        default: 'applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    notes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Prevent duplicate applications
applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
