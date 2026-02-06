import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ManageApplications = () => {
    const [internships, setInternships] = useState([]);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetchInternships();
    }, []);

    useEffect(() => {
        if (selectedInternship) {
            fetchApplications(selectedInternship);
        }
    }, [selectedInternship]);

    const fetchInternships = async () => {
        try {
            const { data } = await api.get('/internships/my-internships');
            setInternships(data);
            if (data.length > 0) setSelectedInternship(data[0]._id);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchApplications = async (internshipId) => {
        try {
            const { data } = await api.get(`/applications/internship/${internshipId}`);
            setApplications(data);
        } catch (error) {
            toast.error('Failed to fetch applications');
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            toast.success(`Application ${newStatus}`);
            fetchApplications(selectedInternship); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Applications</h1>
                <select
                    className="border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    onChange={(e) => setSelectedInternship(e.target.value)}
                    value={selectedInternship || ''}
                >
                    {internships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                </select>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.studentId?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.studentId?.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {app.status === 'applied' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(app._id, 'shortlisted')} className="text-blue-600 hover:text-blue-900">Shortlist</button>
                                            <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </>
                                    )}
                                    {app.status === 'shortlisted' && (
                                        <button onClick={() => handleStatusUpdate(app._id, 'interviewed')} className="text-purple-600 hover:text-purple-900">Interview</button>
                                    )}
                                    {app.status === 'interviewed' && (
                                        <button onClick={() => handleStatusUpdate(app._id, 'approved')} className="text-green-600 hover:text-green-900">Hiring</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No applications found for this internship.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageApplications;
