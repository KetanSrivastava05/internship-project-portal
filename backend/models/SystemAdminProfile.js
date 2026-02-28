const mongoose = require('mongoose');

const systemAdminProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    department: {
        type: String,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    officeLocation: {
        type: String,
        trim: true
    },
    about: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemAdminProfile', systemAdminProfileSchema);
