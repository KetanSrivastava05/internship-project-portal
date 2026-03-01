import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TPOStats = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalInternships: 0,
        totalPlacedStudents: 0,
        activeInternships: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/tpo/analytics');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching TPO analytics:', error);
            toast.error('Failed to load placement analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    // Chart Data
    const pieChartData = [
        { name: 'Placed', value: stats.totalPlacedStudents },
        { name: 'Unplaced', value: Math.max(0, stats.totalStudents - stats.totalPlacedStudents) },
    ];

    const barChartData = [
        { name: 'Total Entities', Students: stats.totalStudents, Companies: stats.totalCompanies, Internships: stats.totalInternships }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detailed Placement Statistics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        In-depth visual analysis of the campus recruitment ecosystem.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placement Ratio Pie Chart */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" />
                            Placement Ratio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Ecosystem Overview Bar Chart */}
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">System Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barChartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="Students" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="Companies" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Bar dataKey="Internships" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default TPOStats;
