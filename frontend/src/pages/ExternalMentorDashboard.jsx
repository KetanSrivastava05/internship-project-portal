import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, FileText, MessageSquare, Bell, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ExternalMentorDashboard = () => {
    const [students, setStudents] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students'); // 'students', 'reports', or 'requests'
    const [selectedReport, setSelectedReport] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({ comments: '', rating: '' });
    const [requests, setRequests] = useState([]);
   
    const [requestsCount, setRequestsCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsRes, reportsRes, requestsRes] = await Promise.all([
                api.get('/external-mentor/students'),
                api.get('/external-mentor/reports'),
                api.get('/external-mentor/requests').catch(() => ({ data: [] })) // Don't fail if no requests
            ]);
            setStudents(studentsRes.data);
            setReports(reportsRes.data);
            setRequests(requestsRes.data || []);
            setRequestsCount(requestsRes.data?.length || 0);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleProvideFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/external-mentor/reports/${selectedReport._id}/feedback`, {
                comments: feedbackForm.comments,
                rating: parseInt(feedbackForm.rating)
            });
            toast.success('Feedback provided successfully!');
            setSelectedReport(null);
            setFeedbackForm({ comments: '', rating: '' });
            fetchData(); // Refresh reports
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to provide feedback');
        }
    };

    if (loading) return <div className="p-6">Loading dashboard...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">External Mentor Dashboard</h1>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'students'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Users className="inline mr-2" size={18} />
                        Assigned Students ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'reports'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <FileText className="inline mr-2" size={18} />
                        Student Reports ({reports.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                            activeTab === 'requests'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Bell className="inline mr-2" size={18} />
                        Requests
                        {requestsCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {requestsCount}
                            </span>
                        )}
                    </button>
                </nav>
            </div>

            {/* Students Tab */}
            {activeTab === 'students' && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Assigned Students</h2>
                    {students.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No students assigned yet.
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {students.map((item, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 font-bold text-xl">
                                            {item.studentId?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{item.studentId?.name}</h3>
                                            <p className="text-sm text-gray-500">{item.studentId?.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <p className="font-medium">Active Internships:</p>
                                        {item.internships?.map((internship, idx) => (
                                            <div key={idx} className="pl-2 border-l-2 border-primary-200">
                                                <p className="font-medium text-gray-900">{internship.internshipId?.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {internship.internshipId?.companyId?.name || 'Company'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        to={`/chat/${item.studentId?._id}`}
                                        className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                                    >
                                        <MessageSquare size={16} className="mr-1" /> Chat
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Student Reports</h2>
                    {reports.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No reports available yet.
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reports.map((report) => (
                                        <tr key={report._id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{report.studentId?.name}</div>
                                                <div className="text-sm text-gray-500">{report.studentId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Week {report.weekNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {report.internshipId?.title || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                    {report.status || 'submitted'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="text-primary-600 hover:text-primary-900"
                                                >
                                                    Provide Feedback
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Mentorship Requests</h2>
                    {requests.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No pending mentorship requests.
                        </div>
                    ) : (
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
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{req.message || 'No message'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await api.put(`/external-mentor/requests/${req._id}`, { status: 'accepted' });
                                                                toast.success('Request accepted successfully');
                                                                fetchData();
                                                            } catch (error) {
                                                                toast.error('Failed to accept request');
                                                            }
                                                        }}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Accept"
                                                    >
                                                        <Check size={20} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await api.put(`/external-mentor/requests/${req._id}`, { status: 'rejected' });
                                                                toast.success('Request rejected');
                                                                fetchData();
                                                            } catch (error) {
                                                                toast.error('Failed to reject request');
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Reject"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Feedback Modal */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedReport(null)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Provide Technical Feedback</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Week {selectedReport.weekNumber} • {selectedReport.studentId?.name}
                        </p>

                        <div className="mb-4 p-4 bg-gray-50 rounded-md">
                            <h4 className="font-medium mb-2">Report Content:</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <strong>Tasks Completed:</strong>
                                    <p className="text-gray-700">{selectedReport.content?.tasksCompleted || 'N/A'}</p>
                                </div>
                                <div>
                                    <strong>Skills Learned:</strong>
                                    <p className="text-gray-700">{selectedReport.content?.skillsLearned || 'N/A'}</p>
                                </div>
                                <div>
                                    <strong>Challenges:</strong>
                                    <p className="text-gray-700">{selectedReport.content?.challenges || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleProvideFeedback} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    required
                                    value={feedbackForm.rating}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Technical Feedback</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={feedbackForm.comments}
                                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                                    placeholder="Provide technical feedback on the student's work..."
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedReport(null);
                                        setFeedbackForm({ comments: '', rating: '' });
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                >
                                    Submit Feedback
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExternalMentorDashboard;
