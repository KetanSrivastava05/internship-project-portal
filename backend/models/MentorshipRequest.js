const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorType: {
        type: String,
        enum: ['faculty', 'external_mentor'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: String
}, {
    timestamps: true
});

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
