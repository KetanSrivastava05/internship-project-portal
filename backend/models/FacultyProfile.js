const mongoose = require('mongoose');

const facultyProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    subjectSpecialization: [{
        type: String,
        trim: true
    }],
    about: String
}, {
    timestamps: true
});

module.exports = mongoose.model('FacultyProfile', facultyProfileSchema);
