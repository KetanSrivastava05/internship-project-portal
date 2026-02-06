import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                        <tr key={app._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.internshipId?.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.internshipId?.companyId?.companyName || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </span>
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
