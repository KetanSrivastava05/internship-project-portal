import React, { useEffect, useState } from 'react';
import InternshipList from '../components/InternshipList';
import StudentApplications from '../components/StudentApplications';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Briefcase, FileText, CheckCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { FadeUp, StaggerContainer, StaggerItem } from '../components/ui/AnimatedWrappers';

// Mock data for Recharts sparklines
const applicationTrend = [{ value: 2 }, { value: 3 }, { value: 1 }, { value: 4 }, { value: 3 }, { value: 6 }];
const reportTrend = [{ value: 5 }, { value: 10 }, { value: 15 }, { value: 20 }, { value: 30 }, { value: 45 }];

const StudentDashboard = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [profileRes, appsRes] = await Promise.all([
                    api.get('/users/profile'),
                    api.get('/applications/my-applications')
                ]);
                
                const profileData = profileRes.data;
                const appsData = appsRes.data;

                if (profileData && profileData.profile) {
                    const loadedMentors = [];
                    if (profileData.profile.mentorId && typeof profileData.profile.mentorId === 'object') {
                        loadedMentors.push({ ...profileData.profile.mentorId, type: 'Legacy Mentor' });
                    }
                    if (profileData.profile.mentors && profileData.profile.mentors.length > 0) {
                        profileData.profile.mentors.forEach(m => {
                            if (m.mentorId) {
                                if (!loadedMentors.some(existing => existing._id === m.mentorId._id)) {
                                    loadedMentors.push({ ...m.mentorId, type: m.mentorType === 'faculty' ? 'Internal' : 'External' });
                                }
                            }
                        });
                    }
                    setMentors(loadedMentors);
                }

                // Generate Activities from Applications
                let generatedActivities = [];
                appsData.forEach(app => {
                    const itemName = app.internshipId ? app.internshipId.title : (app.projectId?.title || 'Opportunity');
                    
                    if (app.appliedAt) {
                        generatedActivities.push({
                            title: 'Application Submitted',
                            desc: itemName,
                            timeStr: getTimeAgo(app.appliedAt),
                            timeStamp: new Date(app.appliedAt).getTime(),
                            color: 'bg-blue-500'
                        });
                    }
                    if (app.status === 'approved' || app.status === 'submitted' || app.status === 'graded') {
                        // We use updatedAt as a proxy for status change if specific dates aren't heavily tracked
                        const statusDate = app.updatedAt || app.appliedAt;
                        generatedActivities.push({
                            title: `Application ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`,
                            desc: itemName,
                            timeStr: getTimeAgo(statusDate),
                            timeStamp: new Date(statusDate).getTime(),
                            color: app.status === 'approved' ? 'bg-green-500' : (app.status === 'graded' ? 'bg-purple-500' : 'bg-orange-500')
                        });
                    }
                });

                // Sort descending by timeStamp and take top 4
                generatedActivities.sort((a, b) => b.timeStamp - a.timeStamp);
                setActivities(generatedActivities.slice(0, 4));

            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
        else setLoading(false);
    }, [user]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <FadeUp className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-1">My Dashboard</h1>
                    <p className="text-secondary-500 text-lg font-medium">Welcome back, {user?.name}!</p>
                </div>
                <div className="flex space-x-3">
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Profile Active
                    </span>
                </div>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StaggerItem>
                    <StatCard
                        title="Applications"
                        value={6}
                        icon={Briefcase}
                        data={applicationTrend}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-100"
                        strokeColor="#2563eb"
                        trend={{ positive: true, value: 12 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Reports Submitted"
                        value={14}
                        icon={FileText}
                        data={reportTrend}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-100"
                        strokeColor="#9333ea"
                        trend={{ positive: true, value: 25 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Profile Score"
                        value={85}
                        icon={TrendingUp}
                        suffix="%"
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-100"
                        strokeColor="#059669"
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Active Tasks"
                        value={3}
                        icon={CheckCircle}
                        colorClass="text-orange-600"
                        bgClass="bg-orange-100"
                        strokeColor="#ea580c"
                    />
                </StaggerItem>
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-secondary-900 tracking-tight">Recent Applications</h2>
                            <Link to="/student/applications" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All →</Link>
                        </div>
                        <StudentApplications />
                    </section>

                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-secondary-900 tracking-tight">Recommended Internships</h2>
                            <Link to="/student/internships" className="text-sm font-medium text-primary-600 hover:text-primary-700">Explore →</Link>
                        </div>
                        <InternshipList limit={3} />
                    </section>
                </div>

                <div className="space-y-8">
                    {/* Mentors Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6">
                        <h2 className="text-xl font-bold text-secondary-900 tracking-tight mb-4">Mentorship</h2>

                        {mentors.length > 0 ? (
                            <div className="space-y-4">
                                {mentors.map(mentor => (
                                    <div key={mentor._id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors border border-secondary-200/50">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-indigo-100 rounded-xl w-12 h-12 flex items-center justify-center text-indigo-700 font-extrabold text-xl shadow-sm">
                                                {mentor.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-secondary-900 tracking-tight">{mentor.name}</h3>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-secondary-500 mt-0.5">{mentor.type}</p>
                                            </div>
                                        </div>
                                        <Link to={`/chat/${mentor._id}`} className="p-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 shadow-sm transition-all hover:scale-105 active:scale-95">
                                            <MessageSquare size={18} />
                                        </Link>
                                    </div>
                                ))}
                                <Link to="/student/request-mentor" className="block text-center text-sm font-semibold text-primary-600 hover:text-primary-700 pt-2">
                                    + Add Another Mentor
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="font-bold text-secondary-900 mb-2">Need Guidance?</h3>
                                <p className="text-sm text-secondary-500 mb-6">Find a faculty or industry mentor to guide your journey.</p>
                                <Link to="/student/request-mentor" className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm w-full">
                                    Find Mentor
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-6">
                        <h2 className="text-xl font-bold text-secondary-900 tracking-tight mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {activities.length > 0 ? (
                                activities.map((activity, i) => (
                                    <div key={i} className="flex relative">
                                        <div className={`w-3 h-3 mt-1.5 rounded-full z-10 ${activity.color} ring-4 ring-white`} />
                                        {i < activities.length - 1 && <div className="absolute top-3 left-1.5 w-[2px] h-16 bg-secondary-200" />}
                                        <div className="ml-4">
                                            <h4 className="text-sm font-bold text-secondary-900">{activity.title}</h4>
                                            <p className="text-xs text-secondary-500 mt-0.5">{activity.desc}</p>
                                            <span className="text-xs font-semibold text-secondary-400 mt-1 block">{activity.timeStr}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-secondary-500">No recent activity found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </FadeUp>
    );
};

export default StudentDashboard;
