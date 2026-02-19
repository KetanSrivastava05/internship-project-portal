import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingRequests: 0,
        reportsReviewed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch students count
            const { data: students } = await api.get('/faculty/my-students');

            // Fetch pending requests count
            const { data: requests } = await api.get('/faculty/requests');

            // For now, we simulate reports reviewed or fetch if endpoint available
            // const { data: reports } = await api.get('/faculty/student-reports');

            setStats({
                totalStudents: students.length,
                pendingRequests: requests.length,
                reportsReviewed: 0 // Placeholder or calculate from reports
            });
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    const cards = [
        { title: 'Mentored Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500', link: '/faculty/students' },
        { title: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'bg-yellow-500', link: '/faculty/requests' },
        { title: 'Reports Reviewed', value: stats.reportsReviewed, icon: CheckCircle, color: 'bg-green-500', link: '/faculty/reports' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Faculty Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        {card.link && (
                            <Link to={card.link} className="text-sm text-primary-600 mt-4 block hover:underline">View Details &rarr;</Link>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link to="/faculty/requests" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Review Requests</Link>
                    <Link to="/faculty/reports" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">View Student Reports</Link>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
