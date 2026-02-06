import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Briefcase, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
    const [stats, setStats] = useState({
        activeInternships: 0,
        totalApplications: 0,
        pendingReview: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real app, you'd have a specific stats endpoint. 
            // Here we might fetch lists and count, or mock for display.
            const { data: internships } = await api.get('/internships/my-internships');
            // For demo purposes, we'll just set some derived or placeholder stats
            setStats({
                activeInternships: internships.filter(i => i.status === 'open').length,
                totalApplications: 12, // Mocked as we didn't make a stats endpoint
                pendingReview: 5
            });
        } catch (error) {
            console.error(error);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4`}
        >
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                <p className="text-gray-600">Manage your recruitment process.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <StatCard title="Active Internships" value={stats.activeInternships} icon={Briefcase} color="bg-blue-500" />
                <StatCard title="Total Applications" value={stats.totalApplications} icon={Users} color="bg-purple-500" />
                <StatCard title="Pending Review" value={stats.pendingReview} icon={CheckCircle} color="bg-orange-500" />
            </div>

            <div className="flex gap-4">
                <Link to="/company/post-internship" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
                    Post New Internship
                </Link>
                <Link to="/company/applications" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                    View Applications
                </Link>
            </div>
        </div>
    );
};

export default CompanyDashboard;
