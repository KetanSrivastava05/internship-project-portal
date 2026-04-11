const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function listUsers() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in .env');
            process.exit(1);
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully.\n');

        const users = await User.find({}, 'name email role');
        
        if (users.length === 0) {
            console.log('No users found in the database.');
        } else {
            console.log('Existing Users:');
            console.log('----------------');
            users.forEach(user => {
                console.log(`Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
            });
            console.log('----------------');
            console.log(`Total users: ${users.length}`);
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

listUsers();
