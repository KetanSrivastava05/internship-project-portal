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

    const [viewingApp, setViewingApp] = useState(null);

    const openAppModal = (app) => {
        setViewingApp(app);
    };

    const closeAppModal = () => {
        setViewingApp(null);
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
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
                                    {app.status === 'approved' && (
                                        <span className="text-green-600 font-medium">Hired</span>
                                    )}
                                    {app.status === 'rejected' && (
                                        <span className="text-red-600 font-medium">Rejected</span>
                                    )}
                                    {app.status === 'applied' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleStatusUpdate(app._id, 'shortlisted')} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200">Shortlist</button>
                                            <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200">Reject</button>
                                        </div>
                                    )}
                                    {app.status === 'shortlisted' && (
                                        <button onClick={() => handleStatusUpdate(app._id, 'interviewed')} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-xs hover:bg-purple-200">Interview</button>
                                    )}
                                    {app.status === 'interviewed' && (
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleStatusUpdate(app._id, 'approved')} className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200">Hire</button>
                                            <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200">Reject</button>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => openAppModal(app)} className="text-primary-600 hover:text-primary-900">View Details</button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No applications found for this internship.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Application Details Modal */}
            {viewingApp && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                                <p className="text-sm text-gray-500">Applicant: {viewingApp.studentId?.name} ({viewingApp.studentId?.email})</p>
                            </div>
                            <button onClick={closeAppModal} className="text-gray-400 hover:text-gray-600">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Cover Letter</h4>
                                <div className="mt-2 p-4 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap">
                                    {viewingApp.coverLetter || 'No cover letter provided.'}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Resume / Portfolio</h4>
                                <div className="mt-2">
                                    <a
                                        href={viewingApp.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        View Resume
                                    </a>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-2">Take Action</h4>
                                <div className="flex gap-2">
                                    {viewingApp.status === 'applied' && (
                                        <>
                                            <button
                                                onClick={() => { handleStatusUpdate(viewingApp._id, 'shortlisted'); closeAppModal(); }}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Shortlist Candidate
                                            </button>
                                            <button
                                                onClick={() => { handleStatusUpdate(viewingApp._id, 'rejected'); closeAppModal(); }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Reject Application
                                            </button>
                                        </>
                                    )}
                                    {viewingApp.status === 'shortlisted' && (
                                        <button
                                            onClick={() => { handleStatusUpdate(viewingApp._id, 'interviewed'); closeAppModal(); }}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                        >
                                            Schedule Interview
                                        </button>
                                    )}
                                    {viewingApp.status === 'interviewed' && (
                                        <button
                                            onClick={() => { handleStatusUpdate(viewingApp._id, 'approved'); closeAppModal(); }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                        >
                                            Approve & Hire
                                        </button>
                                    )}
                                    {['approved', 'rejected'].includes(viewingApp.status) && (
                                        <span className="text-gray-500 italic">No further actions available.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageApplications;
