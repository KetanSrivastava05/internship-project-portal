const mongoose = require('mongoose');

const tpoProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    designation: {
        type: String,
        trim: true,
        default: 'Training & Placement Officer'
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

module.exports = mongoose.model('TPOProfile', tpoProfileSchema);
