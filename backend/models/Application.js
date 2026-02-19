const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
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
        enum: ['applied', 'shortlisted', 'interviewed', 'approved', 'rejected', 'submitted', 'graded'],
        default: 'applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    finalReportUrl: String,
    grade: String,
    evaluationComments: String,
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: Date,
    gradedAt: Date,
    notes: [{
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Prevent duplicate applications for same internship OR project
applicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true, partialFilterExpression: { internshipId: { $type: "objectId" } } });
applicationSchema.index({ projectId: 1, studentId: 1 }, { unique: true, partialFilterExpression: { projectId: { $type: "objectId" } } });

module.exports = mongoose.model('Application', applicationSchema);
