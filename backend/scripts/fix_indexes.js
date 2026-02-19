const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fixIndexes = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const collection = mongoose.connection.collection('applications');

        console.log('Listing current indexes...');
        const indexes = await collection.indexes();
        console.log(indexes);

        console.log('Dropping problematic indexes...');
        try {
            await collection.dropIndex('internshipId_1_studentId_1');
            console.log('Dropped internshipId_1_studentId_1');
        } catch (e) {
            console.log('Index internshipId_1_studentId_1 might not exist or verify name:', e.message);
        }

        try {
            await collection.dropIndex('projectId_1_studentId_1');
            console.log('Dropped projectId_1_studentId_1');
        } catch (e) {
            console.log('Index projectId_1_studentId_1 might not exist or verify name:', e.message);
        }

        console.log('Indexes dropped. They will be recreated by Mongoose on next app start with new definitions.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIndexes();
