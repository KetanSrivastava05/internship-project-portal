import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building, Briefcase, CheckCircle, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { StatCard } from '../components/ui/StatCard';
import { FadeUp, StaggerContainer, StaggerItem } from '../components/ui/AnimatedWrappers';
import { Button } from '../components/ui/Button';

// Mock charts for TPO
const placementTrend = [{ value: 10 }, { value: 25 }, { value: 40 }, { value: 65 }, { value: 80 }, { value: 95 }];

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
                        data={placementTrend}
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
                <h2 className="text-xl font-bold text-secondary-900 mb-6">Placement Distribution (Mock View)</h2>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-secondary-200 rounded-xl bg-secondary-50">
                    <p className="text-secondary-500 font-medium">Detailed Recharts visual goes here mapping domains vs placements.</p>
                </div>
            </div>

        </FadeUp>
    );
};

export default TPODashboard;
