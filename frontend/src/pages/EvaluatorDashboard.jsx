import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Award, FileText, CheckCircle } from 'lucide-react';

const EvaluatorDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [grade, setGrade] = useState('');
    const [comments, setComments] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data } = await api.get('/applications/evaluator/submissions');
            setSubmissions(data);
        } catch (error) {
            toast.error('Failed to load submissions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeClick = (app) => {
        setSelectedApp(app);
        setGrade(app.grade || '');
        setComments(app.evaluationComments || '');
        setIsModalOpen(true);
    };

    const handleSubmitEvaluation = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/applications/evaluate/${selectedApp._id}`, {
                grade,
                evaluationComments: comments
            });
            toast.success('Evaluation submitted successfully');
            setIsModalOpen(false);
            fetchSubmissions(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit evaluation');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Student Evaluations</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project / Internship</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions.map((sub) => (
                            <tr key={sub._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{sub.studentId?.name}</div>
                                    <div className="text-sm text-gray-500">{sub.studentId?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sub.internshipId?.title || sub.projectId?.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                                    <a href={sub.finalReportUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                                        <FileText size={16} className="mr-1" /> View Report
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {sub.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleGradeClick(sub)}
                                        className="text-primary-600 hover:text-primary-900 flex items-center"
                                    >
                                        <Award size={16} className="mr-1" /> {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No pending evaluations.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Grading Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Grade Submission</h2>
                        <form onSubmit={handleSubmitEvaluation}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Grade</label>
                                <input
                                    type="text"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g. A, 90/100"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Comments</label>
                                <textarea
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    rows="4"
                                    placeholder="Feedback for the student..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                                >
                                    Submit Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvaluatorDashboard;
