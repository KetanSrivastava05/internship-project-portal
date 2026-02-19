import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            // Force reload to reset all state
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails, navigate away
            navigate('/');
            window.location.href = '/';
        }
    };

    return (
        <div className="flex h-screen bg-secondary-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex justify-end items-center px-6 z-10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-sm text-gray-600 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-secondary-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
