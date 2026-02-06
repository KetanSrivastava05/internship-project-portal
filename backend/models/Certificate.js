const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
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
    issuedAt: {
        type: Date,
        default: Date.now
    },
    certificateHash: {
        type: String,
        unique: true
    },
    fileUrl: String // URL to PDF if generated/uploaded
}, {
    timestamps: true
});

// Generate hash before saving
certificateSchema.pre('save', function (next) {
    if (!this.certificateHash) {
        const data = `${this.studentId}-${this.internshipId}-${Date.now()}`;
        this.certificateHash = crypto.createHash('sha256').update(data).digest('hex');
    }
    next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
