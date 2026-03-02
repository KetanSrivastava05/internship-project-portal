import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student',
        degree: '', resumeUrl: '', companyName: '', domain: ''
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
                case 'system_admin': navigate('/sysadmin'); break;
                default: navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <AuthLayout title="Create Account" subtitle="Join our platform as a new user">
            <form onSubmit={handleSubmit} className="space-y-5">

                <div className="relative group">
                    <input name="name" type="text" required placeholder="Full Name" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-transparent" onChange={handleChange} />
                    <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Full Name</label>
                </div>

                <div className="relative group">
                    <select name="role" className="w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all text-secondary-900 font-medium appearance-none" onChange={handleChange} value={formData.role}>
                        <option value="student">Student</option>
                        <option value="company">Company / Recruiter</option>
                        <option value="faculty">Faculty (Internal Mentor)</option>
                        <option value="external_mentor">External Mentor (Industry)</option>
                        <option value="evaluator">Evaluator</option>
                        <option value="college_admin">College Admin</option>
                        <option value="tpo">Training & Placement Officer</option>
                        <option value="system_admin">System Admin</option>
                    </select>
                </div>

                <div className="relative group">
                    <input name="email" type="email" required placeholder="Email Address" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-transparent" onChange={handleChange} />
                    <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Email Address</label>
                </div>

                <div className="relative group">
                    <input name="password" type="password" required placeholder="Password" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-transparent" onChange={handleChange} />
                    <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Password</label>
                </div>

                {formData.role === 'student' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <input name="degree" type="text" placeholder="Degree (e.g. B.Tech)" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-transparent" onChange={handleChange} />
                            <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Degree</label>
                        </div>
                        <div className="relative group">
                            <input name="resumeUrl" type="url" placeholder="Resume URL" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-transparent" onChange={handleChange} />
                            <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Resume URL</label>
                        </div>
                    </div>
                )}

                {formData.role === 'company' && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <input name="companyName" type="text" placeholder="Company Name" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-transparent" onChange={handleChange} />
                            <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Company</label>
                        </div>
                        <div className="relative group">
                            <input name="domain" type="text" placeholder="Domain" className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all placeholder-transparent" onChange={handleChange} />
                            <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">Domain</label>
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button type="submit" className="w-full text-lg">
                        Register Account
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-secondary-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors underline decoration-2 decoration-primary-200 hover:decoration-primary-600">
                        Sign In
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Register;
