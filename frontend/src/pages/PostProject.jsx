import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Save, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const PostProject = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        domain: '',
        duration: '',
        maxStudents: 5
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/projects', formData);
            toast.success('Project posted successfully!');
            navigate('/faculty/projects'); // Redirect to list
        } catch (error) {
            console.error('Failed to post project', error);
            toast.error(error.response?.data?.message || 'Failed to post project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Post New Academic Project</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., AI-based Attendance System"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed description of the project..."
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                        <select
                            name="domain"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={formData.domain}
                            onChange={handleChange}
                        >
                            <option value="">Select Domain</option>
                            <option value="Web Development">Web Development</option>
                            <option value="App Development">App Development</option>
                            <option value="Machine Learning/AI">Machine Learning/AI</option>
                            <option value="IoT">IoT</option>
                            <option value="Blockchain">Blockchain</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                            type="text"
                            name="duration"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g., 3 months"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                    <input
                        type="text"
                        name="technologies"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        value={formData.technologies}
                        onChange={handleChange}
                        placeholder="e.g., React, Node.js, MongoDB"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                    <input
                        type="number"
                        name="maxStudents"
                        min="1"
                        max="10"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        value={formData.maxStudents}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                        Post Project
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostProject;
