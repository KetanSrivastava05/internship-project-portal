import React from 'react';
import InternshipList from '../components/InternshipList';
import StudentApplications from '../components/StudentApplications';

const StudentDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                <p className="text-gray-600">Overview of your internship activities.</p>
            </div>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
                </div>
                <StudentApplications />
            </section>

            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Open Internships</h2>
                </div>
                <InternshipList />
            </section>
        </div>
    );
};

export default StudentDashboard;
