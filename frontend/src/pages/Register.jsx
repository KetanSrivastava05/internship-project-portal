import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student', // Default
        // Student specific
        degree: '',
        resumeUrl: '',
        // Company specific
        companyName: '',
        domain: ''
    });

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(formData);
            toast.success('Registration successful!');

            switch (user.role) {
                case 'student': navigate('/student'); break;
                case 'company': navigate('/company'); break;
                case 'faculty': navigate('/faculty'); break;
                case 'external_mentor': navigate('/external-mentor'); break;
                case 'evaluator': navigate('/evaluator'); break;
                case 'college_admin': navigate('/college-admin'); break;
                case 'tpo': navigate('/tpo'); break;
                case 'system_admin': navigate('/system-admin'); break;
                default: navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input name="name" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select name="role" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} value={formData.role}>
                            <option value="student">Student</option>
                            <option value="company">Company / Recruiter</option>
                            <option value="faculty">Faculty (Internal Mentor)</option>
                            <option value="external_mentor">External Mentor (Industry / Alumni)</option>
                            <option value="evaluator">Evaluator</option>
                            <option value="college_admin">College Admin</option>
                            <option value="tpo">Training & Placement Officer (TPO)</option>
                            <option value="system_admin">System Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                    </div>

                    {/* Role specific fields */}
                    {formData.role === 'student' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Degree</label>
                                <input name="degree" type="text" placeholder="e.g. B.Tech CSE" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resume URL</label>
                                <input name="resumeUrl" type="url" placeholder="Link to PDF" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                            </div>
                        </>
                    )}

                    {formData.role === 'company' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                <input name="companyName" type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Domain</label>
                                <input name="domain" type="text" placeholder="e.g. Fintech" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500" onChange={handleChange} />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">Already have an account? Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
