import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleSubmitReport = async (id) => {
        const reportUrl = prompt("Enter your Final Report URL:");
        if (!reportUrl) return;

        try {
            await api.post(`/applications/submit-report/${id}`, { finalReportUrl: reportUrl });
            toast.success('Report submitted successfully!');
            fetchApplications();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit report');
        }
    }

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/applications/my-applications');
            setApplications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'interviewed': return 'bg-purple-100 text-purple-800';
            case 'shortlisted': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800'; // applied
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company / Faculty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action / Grade</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                        <tr key={app._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {app.internshipId ? app.internshipId.title : app.projectId?.title || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.internshipId
                                    ? (app.internshipId.companyId?.companyName || 'N/A')
                                    : (app.projectId?.facultyId?.name ? `Prof. ${app.projectId.facultyId.name}` : 'Faculty Project')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(app.appliedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {app.status === 'approved' && !app.finalReportUrl && (
                                    <button
                                        onClick={() => handleSubmitReport(app._id)}
                                        className="text-primary-600 hover:text-primary-900 font-medium"
                                    >
                                        Submit Report
                                    </button>
                                )}
                                {(app.status === 'submitted' || app.finalReportUrl) && !app.grade && (
                                    <span className="text-yellow-600">Report Submitted</span>
                                )}
                                {app.grade && (
                                    <div>
                                        <span className="font-bold text-gray-900">Grade: {app.grade}</span>
                                        {app.evaluationComments && (
                                            <p className="text-xs text-gray-500 max-w-xs truncate" title={app.evaluationComments}>
                                                {app.evaluationComments}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No applications found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentApplications;
