const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Models
const User = require('../models/User');
const Internship = require('../models/Internship');
const FacultyProfile = require('../models/FacultyProfile');
const ExternalMentorProfile = require('../models/ExternalMentorProfile');

async function cleanupData() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in .env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.\n');

        // 1. Remove all internships
        console.log('Removing all internships...');
        const internshipCount = await Internship.countDocuments();
        await Internship.deleteMany({});
        console.log(`Successfully removed ${internshipCount} internships.\n`);

        // 2. Remove specific users: qwe, rty, uio
        const usersToRemove = ['qwe', 'rty', 'uio'];
        console.log(`Removing users: ${usersToRemove.join(', ')} and their profiles...`);

        for (const name of usersToRemove) {
            const user = await User.findOne({ name });
            if (user) {
                const userId = user._id;
                
                // Remove profiles based on role
                if (user.role === 'faculty') {
                    await FacultyProfile.deleteMany({ userId });
                } else if (user.role === 'external_mentor') {
                    await ExternalMentorProfile.deleteMany({ userId });
                }
                
                // Remove user
                await User.findByIdAndDelete(userId);
                console.log(`Successfully removed user: ${name} (ID: ${userId})`);
            } else {
                console.log(`User with name "${name}" not found.`);
            }
        }

        console.log('\nCleanup completed successfully.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Cleanup Error:', error);
        process.exit(1);
    }
}

cleanupData();
