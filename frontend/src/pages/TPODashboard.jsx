import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Briefcase, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Placement Analytics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Overview of campus placements, internships, and company engagement.
                    </p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70"
                >
                    {generating ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    Generate Placement Report
                </button>
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
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
    >
        <div className={`p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
        </div>
    </motion.div>
);

export default TPODashboard;
