const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const path = require('path');
// Load environment variables with explicit path
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Current directory:', __dirname);
console.log('Attempting to load .env from:', path.resolve(__dirname, '.env'));
console.log('MONGODB_URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Basic Route
app.get('/', (req, res) => {
    res.send('Internship Portal API is running');
});

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const internshipRoutes = require('./routes/internshipRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const chatRoutes = require('./routes/chatRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const reportRoutes = require('./routes/reportRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const externalMentorRoutes = require('./routes/externalMentorRoutes');
const mentorshipRoutes = require('./routes/mentorshipRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Import Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/external-mentor', externalMentorRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/projects', projectRoutes);
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
