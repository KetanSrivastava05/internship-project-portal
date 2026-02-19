import React, { useEffect, useState } from 'react';
import InternshipList from '../components/InternshipList';
import StudentApplications from '../components/StudentApplications';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile to get mentor
                const { data: profileData } = await api.get('/users/profile');
                if (profileData && profileData.profile) {
                    const loadedMentors = [];
                    // Handle legacy single mentor
                    if (profileData.profile.mentorId && typeof profileData.profile.mentorId === 'object') {
                        loadedMentors.push({
                            ...profileData.profile.mentorId,
                            type: 'Legacy Mentor'
                        });
                    }
                    // Handle new multiple mentors array
                    if (profileData.profile.mentors && profileData.profile.mentors.length > 0) {
                        profileData.profile.mentors.forEach(m => {
                            if (m.mentorId) {
                                if (!loadedMentors.some(existing => existing._id === m.mentorId._id)) {
                                    loadedMentors.push({
                                        ...m.mentorId,
                                        type: m.mentorType === 'faculty' ? 'Internal' : 'External'
                                    });
                                }
                            }
                        });
                    }
                    setMentors(loadedMentors);
                }
            } catch (error) {
                console.error('Failed to load dashboard data', error);
                // Don't block rendering if profile fetch fails
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">My Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>

            {/* Mentor Section */}
            {mentors.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">My Mentors</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {mentors.map(mentor => (
                            <div key={mentor._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center text-primary-600 font-bold text-lg">
                                        {mentor.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                                        <p className="text-xs text-gray-500">{mentor.type || 'Mentor'}</p>
                                    </div>
                                </div>
                                <Link to={`/student/my-mentor`} className="text-primary-600 hover:text-primary-700">
                                    <MessageSquare size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">Need a Mentor?</h2>
                        <p className="text-sm text-gray-500">Find a faculty member to guide your internship journey.</p>
                    </div>
                    <Link to="/student/request-mentor" className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Users size={18} className="mr-2" /> Find Mentor
                    </Link>
                </div>
            )}

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
