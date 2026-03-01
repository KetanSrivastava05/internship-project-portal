import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Briefcase, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const TPODashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        totalInternships: 0,
        totalPlacedStudents: 0,
        activeInternships: 0
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
        const toastId = toast.loading('Generating placement report...');
        try {
            const response = await api.get('/tpo/reports');
            const data = response.data;

            if (data.length === 0) {
                toast.error('No placement data available to export.', { id: toastId });
                setGenerating(false);
                return;
            }

            // Convert JSON to CSV
            const headers = ['Application ID', 'Student Name', 'Student Email', 'Company Name', 'Role', 'Approval Date'];
            const csvRows = [headers.join(',')];

            data.forEach(row => {
                const values = [
                    row.applicationId,
                    `"${row.studentName}"`,
                    `"${row.studentEmail}"`,
                    `"${row.companyName}"`,
                    `"${row.role}"`,
                    new Date(row.approvalDate).toLocaleDateString()
                ];
                csvRows.push(values.join(','));
            });

            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `placement_report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 space-y-8"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Placement Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Overview of campus placements, internships, and company engagement.
                    </p>
                </div>
                <Button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="flex items-center gap-2 shadow-sm"
                >
                    {generating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    Generate Report
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    icon={<Users className="w-6 h-6 text-blue-500" />}
                    color="bg-blue-50 dark:bg-blue-900/20"
                />
                <StatCard
                    title="Placed Students"
                    value={stats.totalPlacedStudents}
                    icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
                    color="bg-emerald-50 dark:bg-emerald-900/20"
                />
                <StatCard
                    title="Active Companies"
                    value={stats.totalCompanies}
                    icon={<Building className="w-6 h-6 text-purple-500" />}
                    color="bg-purple-50 dark:bg-purple-900/20"
                />
                <StatCard
                    title="Total Internships"
                    value={stats.totalInternships}
                    icon={<Briefcase className="w-6 h-6 text-orange-500" />}
                    color="bg-orange-50 dark:bg-orange-900/20"
                />
            </div>

        </motion.div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <Card className="border-none shadow-md overflow-hidden relative group">
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${color} ring-1 ring-inset ring-slate-900/5 transition-transform group-hover:scale-110 duration-300 ease-out`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
                    <h4 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
                </div>
            </div>
            {/* Subtle gradient accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </CardContent>
    </Card>
);

export default TPODashboard;
