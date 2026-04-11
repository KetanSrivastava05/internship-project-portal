const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const FacultyProfile = require('../models/FacultyProfile');
const ExternalMentorProfile = require('../models/ExternalMentorProfile');
const EvaluatorProfile = require('../models/EvaluatorProfile');
const CollegeAdminProfile = require('../models/CollegeAdminProfile');
const TPOProfile = require('../models/TPOProfile');
const SystemAdminProfile = require('../models/SystemAdminProfile');

async function seedUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in .env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.');

        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const usersToCreate = [
            // Students (3)
            { name: 'Student One', email: 'student1@portal.com', role: 'student', profileModel: StudentProfile, profileData: { 
                education: { degree: 'B.Tech CSE', institution: 'Sample University', startYear: 2021 },
                resumeUrl: 'https://example.com/resume1.pdf'
            }},
            { name: 'Student Two', email: 'student2@portal.com', role: 'student', profileModel: StudentProfile, profileData: { 
                education: { degree: 'M.Tech IT', institution: 'Tech Institute', startYear: 2022 },
                resumeUrl: 'https://example.com/resume2.pdf'
            }},
            { name: 'Student Three', email: 'student3@portal.com', role: 'student', profileModel: StudentProfile, profileData: { 
                education: { degree: 'B.Sc Physics', institution: 'Science College', startYear: 2020 },
                resumeUrl: 'https://example.com/resume3.pdf'
            }},
            // Companies (3)
            { name: 'Google', email: 'comp1@portal.com', role: 'company', profileModel: CompanyProfile, profileData: { 
                companyName: 'Google', domain: 'Technology', website: 'https://google.com'
            }},
            { name: 'Microsoft', email: 'comp2@portal.com', role: 'company', profileModel: CompanyProfile, profileData: { 
                companyName: 'Microsoft', domain: 'Software', website: 'https://microsoft.com'
            }},
            { name: 'Amazon', email: 'comp3@portal.com', role: 'company', profileModel: CompanyProfile, profileData: { 
                companyName: 'Amazon', domain: 'E-commerce', website: 'https://amazon.com'
            }},
            // Faculty (2)
            { name: 'Dr. Smith', email: 'faculty1@portal.com', role: 'faculty', profileModel: FacultyProfile, profileData: { 
                department: 'Computer Science', designation: 'Professor', employeeId: 'EMP001'
            }},
            { name: 'Dr. Jones', email: 'faculty2@portal.com', role: 'faculty', profileModel: FacultyProfile, profileData: { 
                department: 'Information Technology', designation: 'Associate Professor', employeeId: 'EMP002'
            }},
            // External Mentors (3)
            { name: 'Mentor A', email: 'mentor1@portal.com', role: 'external_mentor', profileModel: ExternalMentorProfile, profileData: { 
                companyName: 'Tech Corp', designation: 'Senior Engineer', domain: 'AI'
            }},
            { name: 'Mentor B', email: 'mentor2@portal.com', role: 'external_mentor', profileModel: ExternalMentorProfile, profileData: { 
                companyName: 'Innovate LLC', designation: 'CTO', domain: 'Web Dev'
            }},
            { name: 'Mentor C', email: 'mentor3@portal.com', role: 'external_mentor', profileModel: ExternalMentorProfile, profileData: { 
                companyName: 'Design Studio', designation: 'Lead Designer', domain: 'UI/UX'
            }},
            // Evaluators (2)
            { name: 'Eval X', email: 'ev1@portal.com', role: 'evaluator', profileModel: EvaluatorProfile, profileData: { 
                department: 'Computer Science', designation: 'External Examiner'
            }},
            { name: 'Eval Y', email: 'ev2@portal.com', role: 'evaluator', profileModel: EvaluatorProfile, profileData: { 
                department: 'Electronics', designation: 'Visiting Faculty'
            }},
            // College Admin (1)
            { name: 'Admin One', email: 'admin1@portal.com', role: 'college_admin', profileModel: CollegeAdminProfile, profileData: { 
                department: 'Administration', designation: 'Registrar'
            }},
            // TPO (1)
            { name: 'TPO Officer', email: 'tpo1@portal.com', role: 'tpo', profileModel: TPOProfile, profileData: { 
                designation: 'Placement Head'
            }},
            // System Admin (1)
            { name: 'SysAdmin', email: 'sysadmin1@portal.com', role: 'system_admin', profileModel: SystemAdminProfile, profileData: { 
                department: 'IT Services', designation: 'System Administrator'
            }}
        ];

        console.log(`Starting to seed ${usersToCreate.length} users...`);

        for (const userData of usersToCreate) {
            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }

            // Create User
            const user = await User.create({
                name: userData.name,
                email: userData.email,
                passwordHash: passwordHash,
                role: userData.role,
                status: 'active'
            });

            // Create Profile
            if (userData.profileModel) {
                await userData.profileModel.create({
                    userId: user._id,
                    ...userData.profileData
                });
            }

            console.log(`Created user: ${userData.email} (${userData.role})`);
        }

        console.log('\nSeeding completed successfully.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
}

seedUsers();
