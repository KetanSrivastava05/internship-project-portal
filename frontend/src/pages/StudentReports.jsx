import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const StudentReports = () => {
    const [reports, setReports] = useState([]);
    const [internships, setInternships] = useState([]); // To select which internship to report for
    const [selectedInternship, setSelectedInternship] = useState('');
    const [formData, setFormData] = useState({
        weekNumber: '',
        content: { tasksCompleted: '', skillsLearned: '', challenges: '' }
    });

    useEffect(() => {
        // Fetch approved internships to allow reporting
        const fetchInternships = async () => {
            // In real app, endpoint to get 'my approved internships'
            // For now, fetching applications and filtering 'approved'
            try {
                const { data } = await api.get('/applications/my-applications');
                const approved = data.filter(app => app.status === 'approved').map(app => app.internshipId);
                setInternships(approved);
                if (approved.length > 0) setSelectedInternship(approved[0]._id);
            } catch (e) {
                console.error(e);
            }
        };
        fetchInternships();
    }, []);

    useEffect(() => {
        if (selectedInternship) fetchReports();
    }, [selectedInternship]);

    const fetchReports = async () => {
        try {
            const { data } = await api.get(`/reports/internship/${selectedInternship}`);
            setReports(data);
        } catch (error) {
            console.error(error);
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

    if (internships.length === 0) return <div className="p-6">You need an approved internship to submit reports.</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Weekly Progress Reports</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Previous Reports</h2>
                {reports.map((report) => (
                    <div key={report._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Week {report.weekNumber}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${report.status === 'reviewed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{report.status}</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Tasks:</strong> {report.content.tasksCompleted}</p>
                            <p><strong>Skills:</strong> {report.content.skillsLearned}</p>
                        </div>
                        {report.mentorFeedback?.comments && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-md text-sm">
                                <p className="font-medium text-gray-900">Mentor Feedback:</p>
                                <p text-gray-600>{report.mentorFeedback.comments}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentReports;
