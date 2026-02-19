const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        trim: true
    }],
    domain: {
        type: String, // e.g., "AI", "Web Dev", "IoT"
        required: true
    },
    duration: {
        type: String, // e.g., "3 months"
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    maxStudents: {
        type: Number,
        default: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
