import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import BackgroundLogos from '../components/BackgroundLogos';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            toast.success('Logged in successfully!');

            // Redirect based on role
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
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <BackgroundLogos />

            <div className="text-center mb-8 relative z-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">InternPortal</h1>
                <p className="text-gray-600 mt-2">Internship & Project Management Portal</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 rounded-xl shadow-xl border border-gray-100 p-8 w-full max-w-md backdrop-blur-md relative z-10"
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/register" className="text-sm text-primary-600 hover:text-primary-500">Don't have an account? Register</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
