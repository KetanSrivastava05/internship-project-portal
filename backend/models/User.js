const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'student',
            'company',
            'faculty',
            'external_mentor',
            'evaluator',
            'college_admin',
            'tpo',
            'system_admin'
        ],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
