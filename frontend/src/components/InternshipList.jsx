import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

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

    const handleApply = async (internshipId) => {
        // Navigate to application form or open modal
        // For simplicity, let's assume a direct apply button triggers a modal (logic elsewhere)
        // or we just show a button that links to details
        // Here: Navigation logic would happen, placeholder alert
        alert(`Navigate to apply for ${internshipId}`);
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

                    <button
                        onClick={() => handleApply(internship._id)}
                        className="w-full mt-2 bg-white border border-primary-600 text-primary-600 py-2 px-4 rounded-md hover:bg-primary-50 transition-colors text-sm font-medium"
                    >
                        View Details & Apply
                    </button>
                </motion.div>
            ))}

            {internships.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-500">
                    No open internships found.
                </div>
            )}
        </div>
    );
};

export default InternshipList;
