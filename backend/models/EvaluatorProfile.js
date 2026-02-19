const mongoose = require('mongoose');

const evaluatorProfileSchema = new mongoose.Schema({
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
        type: String
    },
    expertise: [String],
    experience: {
        type: Number,
        default: 0
    },
    about: String
}, {
    timestamps: true
});

module.exports = mongoose.model('EvaluatorProfile', evaluatorProfileSchema);
