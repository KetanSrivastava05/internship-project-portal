import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Briefcase, CheckCircle, Download, Layers } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { StatCard } from '../components/ui/StatCard';
import { FadeUp, StaggerContainer, StaggerItem } from '../components/ui/AnimatedWrappers';
import { Button } from '../components/ui/Button';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const TPODashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalInternships: 0,
        totalPlacedStudents: 0,
        activeInternships: 0,
        domainStats: []
    });
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

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

    const handleGenerateReport = async () => {
        setGenerating(true);
        const toastId = toast.loading('Generating comprehensive report...');
        try {
            const response = await api.get('/tpo/reports');
            const data = response.data;

            if (data.length === 0) {
                toast.error('No data available to export.', { id: toastId });
                setGenerating(false);
                return;
            }

            const headers = ['Type', 'Title', 'Company/Faculty', 'Status', 'Student Name', 'Student Email', 'Date'];
            const csvRows = [headers.join(',')];

            data.forEach(row => {
                const values = [
                    row.type,
                    `"${row.title.replace(/"/g, '""')}"`,
                    `"${row.provider.replace(/"/g, '""')}"`,
                    `"${row.status}"`,
                    `"${row.studentName}"`,
                    `"${row.studentEmail}"`,
                    new Date(row.date).toLocaleDateString()
                ];
                csvRows.push(values.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success('Report downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report', { id: toastId });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    return (
        <FadeUp className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight mb-1">Placement Analytics</h1>
                    <p className="text-secondary-500 text-lg font-medium">Overview of campus placements, internships, and engagement.</p>
                </div>
                <Button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="flex items-center gap-2 shadow-3d-active"
                >
                    {generating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    Export CSV Report
                </Button>
            </div>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StaggerItem>
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents || 0}
                        icon={Users}
                        colorClass="text-blue-600"
                        bgClass="bg-blue-100"
                        strokeColor="#2563eb"
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Placed Students"
                        value={stats.totalPlacedStudents || 0}
                        icon={CheckCircle}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-100"
                        strokeColor="#059669"
                        trend={{ positive: true, value: 8 }}
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Active Companies"
                        value={stats.totalCompanies || 0}
                        icon={Building}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-100"
                        strokeColor="#9333ea"
                    />
                </StaggerItem>
                <StaggerItem>
                    <StatCard
                        title="Total Internships"
                        value={stats.totalInternships || 0}
                        icon={Briefcase}
                        colorClass="text-orange-600"
                        bgClass="bg-orange-100"
                        strokeColor="#ea580c"
                    />
                </StaggerItem>
            </StaggerContainer>

            <div className="bg-white rounded-2xl p-8 border border-secondary-200 shadow-sm mt-8">
                <div className="flex items-center gap-2 mb-6">
                    <Layers className="w-6 h-6 text-primary-500" />
                    <h2 className="text-xl font-bold text-secondary-900">Placements by Domain</h2>
                </div>
                
                {stats.domainStats && stats.domainStats.length > 0 ? (
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={stats.domainStats}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    width={100}
                                    tick={{ fontSize: 12, fontWeight: 500 }}
                                    stroke="#4B5563"
                                />
                                <Tooltip 
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar 
                                    dataKey="placements" 
                                    radius={[0, 4, 4, 0]}
                                    barSize={30}
                                >
                                    {stats.domainStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-secondary-200 rounded-xl bg-secondary-50">
                        <p className="text-secondary-500 font-medium">No placement data available to visualize yet.</p>
                    </div>
                )}
            </div>

        </FadeUp>
    );
};

export default TPODashboard;
