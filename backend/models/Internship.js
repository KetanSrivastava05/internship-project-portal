const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    companyId: {
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
    skillsRequired: [{
        type: String
    }],
    eligibilityCriteria: {
        minCgpa: Number,
        allowedDepartments: [String],
        other: String
    },
    stipend: {
        amount: String,
        currency: { type: String, default: 'INR' }
    },
    duration: {
        type: String, // e.g., "6 months"
        required: true
    },
    location: {
        type: String, // e.g., "Remote", "Bangalore"
        required: true
    },
    deadline: Date,
    status: {
        type: String,
        enum: ['draft', 'open', 'closed'],
        default: 'draft'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
