import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, Filter, Calendar, Users, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('');

    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchProjectsAndApplications = async () => {
            try {
                const [projectsRes, applicationsRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/applications/my-applications')
                ]);
                setProjects(projectsRes.data);
                setApplications(applicationsRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjectsAndApplications();
    }, []);

    const handleApply = async (projectId) => {
        try {
            await api.post(`/projects/${projectId}/apply`);
            toast.success('Applied successfully!');
            // Update applications list locally
            const { data: newApp } = await api.get('/applications/my-applications');
            setApplications(newApp);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        }
    };

    const isApplied = (projectId) => {
        return applications.some(app => app.projectId && app.projectId._id === projectId);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDomain = filterDomain ? project.domain === filterDomain : true;
        return matchesSearch && matchesDomain;
    });

    if (loading) return <div>Loading available projects...</div>;

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Academic Projects</h1>

            {/* Find Project Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48">
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                            value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                        >
                            <option value="">All Domains</option>
                            <option value="Web Development">Web Development</option>
                            <option value="App Development">App Development</option>
                            <option value="Machine Learning/AI">Machine Learning/AI</option>
                            <option value="IoT">IoT</option>
                            <option value="Blockchain">Blockchain</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Project List */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No projects found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                            <div>
                                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 mb-2">
                                    {project.domain}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{project.description}</p>
                            </div>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center text-sm text-gray-500">
                                    <Code size={16} className="mr-2" />
                                    <span className="truncate">{project.technologies.join(', ')}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{project.duration}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <Users size={16} className="mr-2" />
                                    <span>Posted by {project.facultyId?.name}</span>
                                </div>

                                <button
                                    onClick={() => handleApply(project._id)}
                                    disabled={isApplied(project._id) || project.status !== 'open'}
                                    className={`w-full mt-4 py-2 rounded-md transition-colors ${isApplied(project._id)
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                        : project.status !== 'open'
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                        }`}
                                >
                                    {isApplied(project._id) ? 'Applied' : project.status !== 'open' ? 'Closed' : 'Apply Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentProjectList;
