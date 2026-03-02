import React, { useEffect, useState } from 'react';
import { Users, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { FadeUp, StaggerContainer, StaggerItem } from '../components/ui/AnimatedWrappers';
import { Button } from '../components/ui/Button';

// Mock charts for Faculty
const studentsTrend = [{ value: 10 }, { value: 12 }, { value: 15 }, { value: 20 }, { value: 18 }, { value: 25 }];
const requestsTrend = [{ value: 0 }, { value: 2 }, { value: 5 }, { value: 1 }, { value: 8 }, { value: 4 }];

const FacultyDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingRequests: 0,
        reportsReviewed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: students } = await api.get('/faculty/my-students');
                const { data: requests } = await api.get('/faculty/requests');
                setStats({
                    totalStudents: students.length || 0,
                    pendingRequests: requests.length || 0,
                    reportsReviewed: 12 // Placeholder
                });
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );

    return (
        <FadeUp className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-1">Faculty Dashboard</h1>
                    <p className="text-secondary-500 text-lg font-medium">Monitor your mentees and evaluate report submissions.</p>
                </div>
                <div className="flex space-x-3">
                    <Link to="/faculty/requests">
                        <Button variant="outline" className="text-secondary-900 border-secondary-300">
                            {stats.pendingRequests > 0 && <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping" />}
                            Filter Requests
                        </Button>
                    </Link>
                </div>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaggerItem>
                    <StatCard
                        title="Mentored Students"
                        value={stats.totalStudents}
                        icon={Users}
                        data={studentsTrend}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-100"
                        strokeColor="#2563eb"
                        trend={{ positive: true, value: 15 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Pending Requests"
                        value={stats.pendingRequests}
                        icon={Clock}
                        data={requestsTrend}
                        colorClass="text-amber-600"
                        bgClass="bg-amber-100"
                        strokeColor="#d97706"
                        trend={stats.pendingRequests > 0 ? { positive: false, value: 50 } : null}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Reports Evaluated"
                        value={stats.reportsReviewed}
                        icon={CheckCircle}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-100"
                        strokeColor="#059669"
                        trend={{ positive: true, value: 30 }}
                    />
                </StaggerItem>
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm relative overflow-hidden group hover:border-primary-300 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity duration-500" />
                    <h2 className="text-xl font-bold text-secondary-900 mb-2 relative z-10 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-primary-500" /> Request Inbox
                    </h2>
                    <p className="text-secondary-500 mb-6 relative z-10">You have <span className="font-bold text-secondary-900">{stats.pendingRequests}</span> student mentorship requests waiting for approval.</p>
                    <Link to="/faculty/requests">
                        <Button variant={stats.pendingRequests > 0 ? "primary" : "outline"} className="w-full relative z-10">
                            Review Inbox {stats.pendingRequests > 0 && `(${stats.pendingRequests})`} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-30 pointer-events-none group-hover:opacity-60 transition-opacity duration-500" />
                    <h2 className="text-xl font-bold text-secondary-900 mb-2 relative z-10 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-emerald-500" /> Weekly Reports
                    </h2>
                    <p className="text-secondary-500 mb-6 relative z-10">Provide feedback and evaluate your students' weekly progress submissions.</p>
                    <Link to="/faculty/reports">
                        <Button variant="outline" className="w-full relative z-10 bg-white border-secondary-300">
                            Evaluate Reports <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

        </FadeUp>
    );
};

export default FacultyDashboard;
