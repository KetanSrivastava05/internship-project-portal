import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Briefcase, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { FadeUp, StaggerContainer, StaggerItem } from '../components/ui/AnimatedWrappers';
import { Button } from '../components/ui/Button';

// Mock charts for Company
const activeTrend = [{ value: 0 }, { value: 1 }, { value: 1 }, { value: 3 }, { value: 2 }, { value: 5 }];
const appsTrend = [{ value: 10 }, { value: 25 }, { value: 30 }, { value: 55 }, { value: 45 }, { value: 90 }];

const CompanyDashboard = () => {
    const [stats, setStats] = useState({
        activeInternships: 0,
        totalApplications: 0,
        hiredInterns: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/company');
                setStats({
                    activeInternships: data.activeInternships || 0,
                    totalApplications: data.totalApplications || 0,
                    hiredInterns: data.hiredInterns || 0
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
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
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-1">Company Dashboard</h1>
                    <p className="text-secondary-500 text-lg font-medium">Manage your recruitment pipeline and active interns.</p>
                </div>
                <div className="flex space-x-3">
                    <Link to="/company/post-internship">
                        <Button className="shadow-3d-active">
                            Post New Internship
                        </Button>
                    </Link>
                </div>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StaggerItem>
                    <StatCard
                        title="Active Internships"
                        value={stats.activeInternships}
                        icon={Briefcase}
                        data={activeTrend}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-100"
                        strokeColor="#2563eb"
                        trend={{ positive: true, value: 50 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Total Applications"
                        value={stats.totalApplications}
                        icon={Users}
                        data={appsTrend}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-100"
                        strokeColor="#9333ea"
                        trend={{ positive: true, value: 120 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Hired Interns"
                        value={stats.hiredInterns}
                        icon={CheckCircle}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-100"
                        strokeColor="#059669"
                    />
                </StaggerItem>
            </StaggerContainer>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <h2 className="text-xl font-bold text-secondary-900 mb-2 relative z-10">Recent Applications</h2>
                    <p className="text-secondary-500 mb-6 relative z-10">Review new talent applying to your openings.</p>
                    <Link to="/company/applications">
                        <Button variant="outline" className="w-full relative z-10 bg-white">
                            View Pipeline <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-secondary-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
                    <h2 className="text-xl font-bold text-secondary-900 mb-2 relative z-10">Post Opportunities</h2>
                    <p className="text-secondary-500 mb-6 relative z-10">Create new listings to attract the best candidates from the campus.</p>
                    <Link to="/company/post-internship">
                        <Button variant="primary" className="w-full relative z-10">
                            Create Posting <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>

        </FadeUp>
    );
};

export default CompanyDashboard;
