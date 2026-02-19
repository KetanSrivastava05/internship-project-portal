import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, User, FileText, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectApplications = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch project details just for the title
                // We don't have a direct "get project by id" that is public/faculty easily available without list 
                // but we can assume /projects will return list, or add a specific route.
                // Or easier: fetch applications, they might have project details or we handle it UI side.
                // The endpoint /api/projects/:id/applications is what we use.
                // Let's assume we want project title header.
                const { data } = await api.get(`/projects/${projectId}/applications`);
                setApplications(data);
            } catch (error) {
                console.error('Failed to fetch applications', error);
                toast.error('Failed to load applications');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [projectId]);

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const { data } = await api.put(`/projects/applications/${applicationId}/status`, { status: newStatus });
            setApplications(applications.map(app => app._id === applicationId ? data : app));
            toast.success(`Application ${newStatus}`);
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading applications...</div>;

    return (
        <div className="space-y-6">
            <button onClick={() => navigate('/faculty/projects')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
                <ArrowLeft size={18} className="mr-2" /> Back to Projects
            </button>

            <h1 className="text-2xl font-bold text-gray-900 mb-6">Project Applications</h1>

            {applications.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <User size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Applications Yet</h3>
                    <p className="text-gray-500 mt-2">No students have applied for this project yet.</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {applications.map((app) => (
                            <li key={app._id} className="p-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                                                {app.studentId?.name?.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-bold text-gray-900">{app.studentId?.name}</h4>
                                            <p className="text-sm text-gray-500">{app.studentId?.email}</p>
                                            <div className="mt-1 flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                                    ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {app.status}
                                                </span>
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <FileText size={14} className="mr-1" /> View Resume
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {app.status === 'applied' || app.status === 'shortlisted' ? (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                    className="items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    <Check size={16} className="mr-1 inline" /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    <X size={16} className="mr-1 inline" /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">
                                                {app.status === 'approved' ? 'Application Accepted' : 'Application Rejected'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProjectApplications;
