const mongoose = require('mongoose');

const weeklyReportSchema = new mongoose.Schema({
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship', // Or Application, depending on how you link running internships. Linking to Internship for context.
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekNumber: {
        type: Number,
        required: true
    },
    startDate: Date,
    endDate: Date,
    content: {
        tasksCompleted: String,
        skillsLearned: String,
        challenges: String
    },
    mentorFeedback: {
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Faculty or Company Mentor
        comments: String,
        rating: Number, // 1-5 or similar
        givenAt: Date
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewed'],
        default: 'submitted'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);
