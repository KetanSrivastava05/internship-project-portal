import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const StudentReports = () => {
    const { user, loading: authLoading } = useAuth();
    const [reports, setReports] = useState([]);
    const [internships, setInternships] = useState([]); // To select which internship to report for
    const [selectedInternship, setSelectedInternship] = useState('');
    const [formData, setFormData] = useState({
        weekNumber: '',
        content: { tasksCompleted: '', skillsLearned: '', challenges: '' }
    });
    const [loading, setLoading] = useState(true);
    const [viewingReport, setViewingReport] = useState(null);

    // Get query params
    const queryParams = new URLSearchParams(window.location.search);
    const studentIdParam = queryParams.get('studentId');

    useEffect(() => {
        // Fetch approved internships to allow reporting
        const fetchInternships = async () => {
            if (!user || user.role !== 'student') return; // Only students need to fetch internships for reporting
            try {
                const { data } = await api.get('/applications/my-applications');
                const approved = data.filter(app => app.status === 'approved').map(app => app.internshipId);
                setInternships(approved);
                if (approved.length > 0) setSelectedInternship(approved[0]._id);
            } catch (e) {
                console.error(e);
            }
        };
        if (user && !authLoading) {
            fetchInternships();
        }
    }, [user?.role, authLoading]);

    useEffect(() => {
        if (user && !authLoading) {
            fetchReports();
        }
    }, [selectedInternship, user?.role, authLoading]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            let url = '/reports'; // Default for student

            if (user.role === 'faculty') {
                url = '/faculty/student-reports';
            }

            const { data } = await api.get(url);

            let filteredReports = data || [];

            // Filter by studentId if param exists and user is faculty
            if (user.role === 'faculty' && studentIdParam) {
                filteredReports = filteredReports.filter(r => {
                    const studentId = r.studentId?._id || r.studentId;
                    return studentId?.toString() === studentIdParam || studentId === studentIdParam;
                });
            } 
            // Filter by selectedInternship if student has selected one
            else if (user.role === 'student' && selectedInternship) {
                filteredReports = filteredReports.filter(r => {
                    const internshipId = r.internshipId?._id || r.internshipId;
                    return internshipId?.toString() === selectedInternship || internshipId === selectedInternship;
                });
            }

            setReports(filteredReports);
        } catch (error) {
            console.error('Failed to fetch reports:', error);
            toast.error(error.response?.data?.message || 'Failed to load reports');
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/reports', {
                internshipId: selectedInternship,
                weekNumber: formData.weekNumber,
                content: formData.content
            });
            toast.success('Report submitted successfully');
            fetchReports();
            setFormData({ weekNumber: '', content: { tasksCompleted: '', skillsLearned: '', challenges: '' } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit report');
        }
    };

    if (authLoading) return <div>Loading...</div>;
    if (loading) return <div className="p-6">Loading reports...</div>;

    const isStudent = user.role === 'student';

    if (isStudent && internships.length === 0) return <div className="p-6">You need an approved internship to submit reports.</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{isStudent ? 'My Weekly Reports' : 'Student Reports'}</h1>

            {isStudent && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Submit New Report</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <select
                            className="block w-full border-gray-300 rounded-md shadow-sm"
                            value={selectedInternship}
                            onChange={(e) => setSelectedInternship(e.target.value)}
                        >
                            {internships.map(i => <option key={i._id} value={i._id}>{i.title}</option>)}
                        </select>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Week Number</label>
                            <input type="number" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.weekNumber}
                                onChange={(e) => setFormData({ ...formData, weekNumber: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tasks Completed</label>
                            <textarea required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows="3"
                                value={formData.content.tasksCompleted}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, tasksCompleted: e.target.value } })}></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Skills Learned</label>
                            <textarea required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows="2"
                                value={formData.content.skillsLearned}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, skillsLearned: e.target.value } })}></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Challenges Faced</label>
                            <textarea required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" rows="2"
                                value={formData.content.challenges}
                                onChange={(e) => setFormData({ ...formData, content: { ...formData.content, challenges: e.target.value } })}></textarea>
                        </div>

                        <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Submit Report</button>
                    </form>
                </div>
            )}

            {/* Previous Reports List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <h2 className="text-lg font-semibold p-6 border-b border-gray-200">
                    {isStudent ? 'Submission History' : 'Submitted Reports'}
                </h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {!isStudent && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report) => (
                            <tr key={report._id}>
                                {!isStudent && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{report.studentId?.name}</div>
                                        <div className="text-sm text-gray-500">{report.studentId?.email}</div>
                                    </td>
                                )}
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Week {report.weekNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(report.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                                            report.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {report.status || 'submitted'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => setViewingReport(report)}
                                        className="text-primary-600 hover:text-primary-900"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {reports.length === 0 && (
                            <tr><td colSpan={isStudent ? 5 : 6} className="px-6 py-4 text-center text-gray-500">No reports found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Report Details Modal */}
            {viewingReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setViewingReport(null)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Weekly Report Details</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Week {viewingReport.weekNumber} • {new Date(viewingReport.createdAt).toLocaleDateString()}
                                </p>
                                {!isStudent && (
                                    <p className="text-sm text-gray-500">
                                        Student: {viewingReport.studentId?.name} ({viewingReport.studentId?.email})
                                    </p>
                                )}
                                {viewingReport.internshipId && (
                                    <p className="text-sm text-gray-500">
                                        Internship: {viewingReport.internshipId?.title || 'N/A'}
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => setViewingReport(null)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Tasks Completed</h4>
                                <div className="p-4 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap min-h-[80px]">
                                    {viewingReport.content?.tasksCompleted || 'No tasks completed information provided.'}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Skills Learned</h4>
                                <div className="p-4 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap min-h-[80px]">
                                    {viewingReport.content?.skillsLearned || 'No skills learned information provided.'}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Challenges Faced</h4>
                                <div className="p-4 bg-gray-50 rounded-md text-gray-700 whitespace-pre-wrap min-h-[80px]">
                                    {viewingReport.content?.challenges || 'No challenges information provided.'}
                                </div>
                            </div>

                            {viewingReport.mentorFeedback && (
                                <div className="border-t pt-6">
                                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Mentor Feedback</h4>
                                    <div className="p-4 bg-primary-50 rounded-md">
                                        {viewingReport.mentorFeedback.rating && (
                                            <div className="mb-2">
                                                <span className="text-sm font-medium text-gray-700">Rating: </span>
                                                <span className="text-sm text-gray-900">{viewingReport.mentorFeedback.rating}/5</span>
                                            </div>
                                        )}
                                        <div className="text-gray-700 whitespace-pre-wrap">
                                            {viewingReport.mentorFeedback.comments || 'No comments provided.'}
                                        </div>
                                        {viewingReport.mentorFeedback.givenAt && (
                                            <div className="text-xs text-gray-500 mt-2">
                                                Feedback given on: {new Date(viewingReport.mentorFeedback.givenAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={() => setViewingReport(null)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentReports;
