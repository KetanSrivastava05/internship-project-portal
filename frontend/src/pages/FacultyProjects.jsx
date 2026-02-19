import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Trash2, Edit, Plus, FolderOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const FacultyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects/my-projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted');
            setProjects(projects.filter(p => p._id !== id));
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    const handleToggleStatus = async (project) => {
        try {
            const newStatus = project.status === 'open' ? 'closed' : 'open';
            const { data } = await api.put(`/projects/${project._id}`, { status: newStatus });
            setProjects(projects.map(p => p._id === project._id ? data : p));
            toast.success(`Project marked as ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div>Loading projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Academic Projects</h1>
                <Link to="/faculty/post-project" className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    <Plus size={18} className="mr-2" /> Post New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No Projects Posted</h3>
                    <p className="text-gray-500 mt-2">Get started by posting a new academic project for students.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mt-2 ${project.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {(project.status || 'OPEN').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <Link
                                        to={`/faculty/projects/${project._id}/applications`}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                        title="View Applications"
                                    >
                                        <Users size={18} />
                                    </Link>
                                </div>
                            </div>

                            <p className="text-gray-600 line-clamp-3 mb-4">{project.description}</p>

                            <div className="space-y-2 text-sm text-gray-500">
                                <p><span className="font-medium">Domain:</span> {project.domain}</p>
                                <p><span className="font-medium">Duration:</span> {project.duration}</p>
                                <p><span className="font-medium">Tech Stack:</span> {project.technologies ? project.technologies.join(', ') : 'N/A'}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Max Students: {project.maxStudents}</span>
                                <button
                                    onClick={() => handleToggleStatus(project)}
                                    className="text-sm text-primary-600 hover:underline font-medium"
                                >
                                    {project.status === 'open' ? 'Close Project' : 'Re-open Project'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacultyProjects;
