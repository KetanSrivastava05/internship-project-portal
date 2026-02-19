import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Check, X, UserPlus, FileText, BarChart, Users, Briefcase } from 'lucide-react';

const CollegeAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('approvals');
    const [internships, setInternships] = useState([]);
    const [students, setStudents] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial data fetch based on active tab
    useEffect(() => {
        if (activeTab === 'approvals') fetchPendingInternships();
        if (activeTab === 'mentors') { fetchStudents(); fetchFaculty(); }
        if (activeTab === 'reports') fetchReports();
    }, [activeTab]);

    const fetchPendingInternships = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/internships/pending');
            setInternships(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch pending internships');
        } finally { setLoading(false); }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/admin/students');
            setStudents(data);
        } catch (error) { toast.error('Failed to fetch students'); }
    };

    const fetchFaculty = async () => {
        try {
            const { data } = await api.get('/admin/faculty');
            setFaculty(data);
        } catch (error) { toast.error('Failed to fetch faculty'); }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/reports');
            setReports(data);
        } catch (error) { toast.error('Failed to fetch reports'); }
        finally { setLoading(false); }
    };

    const handleApproval = async (id, status) => {
        try {
            await api.put(`/admin/internships/${id}/approve`, { status });
            toast.success(`Internship ${status} successfully`);
            fetchPendingInternships();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleAssignMentor = async (studentId, mentorId) => {
        if (!mentorId) return;
        try {
            await api.post('/admin/assign-mentor', { studentId, mentorId });
            toast.success('Mentor assigned successfully');
            fetchStudents(); // Refresh to show updated assignment
        } catch (error) {
            toast.error(error.response?.data?.message || 'Assignment failed');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">College Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'approvals' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('approvals')}
                >
                    Internship Approvals
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'mentors' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('mentors')}
                >
                    Mentor Assignment
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'reports' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Academic Reports
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow p-6 min-h-[400px]">
                {loading && <div className="text-center py-4">Loading...</div>}

                {/* Approvals Tab */}
                {!loading && activeTab === 'approvals' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Pending Internship Approvals</h2>
                        {internships.length === 0 ? (
                            <p className="text-gray-500">No pending approvals.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {internships.map(internship => (
                                            <tr key={internship._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{internship.companyId?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internship.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => handleApproval(internship._id, 'approved')}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproval(internship._id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <X size={18} />
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

                {/* Mentor Assignment Tab */}
                {!loading && activeTab === 'mentors' && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold mb-4">Assign Faculty Mentors</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Mentor(s)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign New</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {student.name}
                                                <div className="text-xs text-gray-500">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {student.mentors && student.mentors.length > 0 ? (
                                                    student.mentors.map((m, idx) => (
                                                        <div key={idx} className="text-xs">{m.mentorId?.name} ({m.mentorType})</div>
                                                    ))
                                                ) : <span className="text-yellow-500">Unassigned</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                    onChange={(e) => handleAssignMentor(student._id, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Select Faculty</option>
                                                    {faculty.map(f => (
                                                        <option key={f._id} value={f._id}>{f.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reports Tab */}
                {!loading && activeTab === 'reports' && reports && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">System Reports</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg flex items-center shadow-sm">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{reports.users.students}</p>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex items-center shadow-sm">
                                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                    <Briefcase size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Internships</p>
                                    <p className="text-2xl font-bold text-gray-900">{reports.internships.active}</p>
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg flex items-center shadow-sm">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Applications</p>
                                    <p className="text-2xl font-bold text-gray-900">{reports.applications.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">User Stats</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between"><span>Faculty:</span> <span className="font-bold">{reports.users.faculty}</span></li>
                                    <li className="flex justify-between"><span>Companies:</span> <span className="font-bold">{reports.users.companies}</span></li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-medium text-gray-700 mb-2">Internship Stats</h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex justify-between"><span>Pending Approval:</span> <span className="font-bold">{reports.internships.pending}</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollegeAdminDashboard;
