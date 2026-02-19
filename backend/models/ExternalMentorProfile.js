const mongoose = require('mongoose');

const externalMentorProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    experience: {
        type: Number
    },
    linkedinUrl: String,
    location: String,
    expertise: [{
        type: String,
        trim: true
    }],
    about: String
}, {
    timestamps: true
});

module.exports = mongoose.model('ExternalMentorProfile', externalMentorProfileSchema);
