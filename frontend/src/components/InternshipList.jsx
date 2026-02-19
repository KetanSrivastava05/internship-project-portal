import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const InternshipList = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            const { data } = await api.get('/internships');
            setInternships(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load internships');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user applications to check status
    const [myApplicationIds, setMyApplicationIds] = useState(new Set());

    useEffect(() => {
        const fetchMyApplications = async () => {
            try {
                const { data } = await api.get('/applications/my-applications');
                // Safe access to internshipId, filter out nulls
                const ids = new Set(data.map(app => app.internshipId?._id).filter(Boolean));
                setMyApplicationIds(ids);
            } catch (error) {
                console.error("Failed to fetch my applications", error);
            }
        };
        fetchMyApplications();
    }, []);

    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applicationForm, setApplicationForm] = useState({ resumeUrl: '', coverLetter: '' });

    const handleApplyClick = (internship) => {
        setSelectedInternship(internship);
    };

    const handleCloseModal = () => {
        setSelectedInternship(null);
        setApplicationForm({ resumeUrl: '', coverLetter: '' });
    };

    const handleFormChange = (e) => {
        setApplicationForm({ ...applicationForm, [e.target.name]: e.target.value });
    };

    const handleSubmitApplication = async (e) => {
        e.preventDefault();
        try {
            await api.post('/applications', {
                internshipId: selectedInternship._id,
                ...applicationForm
            });
            toast.success('Application submitted successfully!');
            setMyApplicationIds(prev => new Set(prev).add(selectedInternship._id)); // Update local state
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        }
    };

    if (loading) return <div className="text-center py-10">Loading opportunities...</div>;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {internships.map((internship) => (
                <motion.div
                    key={internship._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                            <p className="text-sm text-primary-600 font-medium">{internship.companyId?.name || 'Company'}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full capitalize">
                            {internship.status}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {internship.location}
                        </div>
                        <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {internship.stipend?.amount || 'Unpaid'} {internship.stipend?.currency}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {internship.duration}
                        </div>
                    </div>

                    {myApplicationIds.has(internship._id) ? (
                        <button
                            disabled
                            className="w-full mt-2 bg-gray-100 border border-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed text-sm font-medium"
                        >
                            Applied
                        </button>
                    ) : (
                        <button
                            onClick={() => handleApplyClick(internship)}
                            className="w-full mt-2 bg-white border border-primary-600 text-primary-600 py-2 px-4 rounded-md hover:bg-primary-50 transition-colors text-sm font-medium"
                        >
                            Apply Now
                        </button>
                    )}
                </motion.div>
            ))}

            {internships.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No open internships found.
                </div>
            )}

            {/* Apply Modal */}
            {selectedInternship && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Apply for {selectedInternship.title}</h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitApplication} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resume URL</label>
                                <input
                                    type="url"
                                    name="resumeUrl"
                                    required
                                    placeholder="https://drive.google.com/..."
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border"
                                    value={applicationForm.resumeUrl}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                                <textarea
                                    name="coverLetter"
                                    rows="4"
                                    required
                                    placeholder="Why are you a good fit?"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border"
                                    value={applicationForm.coverLetter}
                                    onChange={handleFormChange}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                >
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InternshipList;
