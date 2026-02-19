import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PostInternship = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        stipend: { amount: '', currency: 'INR' },
        duration: '',
        location: '',
        status: 'open',
        deadline: '',
        skillsRequired: '', // Comma separated
        minCgpa: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('stipend.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, stipend: { ...prev.stipend, [field]: value } }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Transform data before sending
            const payload = {
                ...formData,
                skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
                eligibilityCriteria: {
                    minCgpa: formData.minCgpa
                }
            };
            await api.post('/internships', payload);
            toast.success('Internship posted successfully!');
            navigate('/company');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to post internship');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Post New Internship</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stipend Amount</label>
                        <input type="number" name="stipend.amount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <input type="text" name="duration" placeholder="e.g. 6 months" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" name="location" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deadline</label>
                        <input type="date" name="deadline" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Skills Required (comma separated)</label>
                    <input type="text" name="skillsRequired" placeholder="React, Node.js, MongoDB" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Minimum CGPA</label>
                    <input type="number" step="0.1" name="minCgpa" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">Post Internship</button>
                </div>
            </form>
        </div>
    );
};

export default PostInternship;
