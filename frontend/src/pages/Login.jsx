import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { AuthLayout } from '../layouts/AuthLayout';
import { Button } from '../components/ui/Button';

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
                case 'system_admin': navigate('/sysadmin'); break;
                default: navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                    <input
                        type="email"
                        required
                        className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-transparent"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">
                        Email Address
                    </label>
                </div>
                <div className="relative group">
                    <input
                        type="password"
                        required
                        className="peer w-full px-4 py-3 bg-white border-2 border-secondary-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-transparent"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="absolute left-4 top-1/2 text-secondary-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary-600 bg-white px-1 font-medium pointer-events-none -translate-y-1/2">
                        Password
                    </label>
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full text-lg">
                        Sign In
                    </Button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-secondary-600 font-medium">
                    New here?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors underline decoration-2 decoration-primary-200 hover:decoration-primary-600">
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default Login;
