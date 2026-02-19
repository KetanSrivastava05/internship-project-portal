import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Check, X } from 'lucide-react';

const MentorshipRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/faculty/requests');
            setRequests(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, status) => {
        try {
            await api.put(`/faculty/requests/${requestId}`, { status });
            toast.success(`Request ${status} successfully`);
            fetchRequests(); // Refresh list
        } catch (error) {
            toast.error('Failed to update request');
        }
    };

    if (loading) return <div>Loading requests...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Mentorship Requests</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{req.studentId?.name}</div>
                                    <div className="text-sm text-gray-500">{req.studentId?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleAction(req._id, 'accepted')}
                                        className="text-green-600 hover:text-green-900 mr-4"
                                        title="Accept"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleAction(req._id, 'rejected')}
                                        className="text-red-600 hover:text-red-900"
                                        title="Reject"
                                    >
                                        <X size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">No pending mentorship requests.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MentorshipRequests;
