import React, { useEffect, useState } from 'react';
import InternshipList from '../components/InternshipList';
import StudentApplications from '../components/StudentApplications';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">My Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}!</p>
            </div>

            {/* Mentor Section */}
            {mentors.length > 0 ? (
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="h-5 w-5 text-indigo-500" />
                            My Mentors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {mentors.map(mentor => (
                                <motion.div
                                    key={mentor._id}
                                    whileHover={{ y: -2 }}
                                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full w-12 h-12 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shadow-sm">
                                            {mentor.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{mentor.name}</h3>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{mentor.type || 'Mentor'}</p>
                                        </div>
                                    </div>
                                    <Link to={`/student/my-mentor`}>
                                        <Button size="icon" variant="ghost" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                                            <MessageSquare className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-none shadow-sm relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10">
                        <Users className="h-32 w-32 text-indigo-500" />
                    </div>
                    <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-6 relative z-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Need a Mentor?</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-md">Find a faculty member to guide your internship journey, provide feedback, and help you succeed.</p>
                        </div>
                        <Link to="/student/request-mentor">
                            <Button className="flex items-center gap-2 whitespace-nowrap shadow-sm">
                                <UserPlus size={18} /> Find Mentor
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Applications</h2>
                    </div>
                    {/* Assuming StudentApplications handles its own modern styling or wraps in a card implicitly if not we will wrap it here. Standardizing by wrapping it in a Card. */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="p-1">
                            <StudentApplications />
                        </div>
                    </Card>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Open Internships</h2>
                    </div>
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="p-1">
                            <InternshipList />
                        </div>
                    </Card>
                </section>
            </div>
        </motion.div>
    );
};

export default StudentDashboard;
