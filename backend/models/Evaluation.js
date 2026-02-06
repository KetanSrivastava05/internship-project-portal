const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
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
    evaluatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    criteriaRatings: {
        technicalSkills: { type: Number, min: 1, max: 10 },
        communication: { type: Number, min: 1, max: 10 },
        punctuality: { type: Number, min: 1, max: 10 },
        teamwork: { type: Number, min: 1, max: 10 }
    },
    grade: {
        type: String, // A, B, C, etc.
        required: true
    },
    remarks: String,
    finalized: {
        type: Boolean,
        default: true // Immutable as per requirements
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
