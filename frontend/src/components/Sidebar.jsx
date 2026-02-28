import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Briefcase,
    FileText,
    Award,
    Users,
    BarChart,
    Settings,
    MessageSquare
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const getLinks = (role) => {
        switch (role) {
            case 'student':
                return [
                    { name: 'Dashboard', path: '/student', icon: Home },
                    { name: 'Internships', path: '/student/internships', icon: Briefcase },
                    { name: 'My Applications', path: '/student/applications', icon: FileText },
                    { name: 'Weekly Reports', path: '/student/reports', icon: BarChart },
                    { name: 'Request Mentor', path: '/student/request-mentor', icon: Users },
                    { name: 'My Mentor', path: '/student/my-mentor', icon: MessageSquare },
                    { name: 'My Profile', path: '/profile', icon: Users },
                    { name: 'Academic Projects', path: '/student/projects', icon: FileText },
                ];
            case 'company':
                return [
                    { name: 'Dashboard', path: '/company', icon: Home },
                    { name: 'Post Internship', path: '/company/post-internship', icon: Briefcase },
                    { name: 'Manage Applications', path: '/company/applications', icon: Users },
                    { name: 'Company Profile', path: '/profile', icon: Settings },
                ];
            case 'faculty':
                return [
                    { name: 'Dashboard', path: '/faculty', icon: Home },
                    { name: 'Mentorship Requests', path: '/faculty/requests', icon: Users },
                    { name: 'My Students', path: '/faculty/students', icon: Users },
                    { name: 'Student Reports', path: '/faculty/reports', icon: FileText },
                    { name: 'My Projects', path: '/faculty/projects', icon: Briefcase },
                    { name: 'Post Project', path: '/faculty/post-project', icon: Users },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];
            case 'external_mentor':
                return [
                    { name: 'Dashboard', path: '/external-mentor', icon: Home },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];
            case 'evaluator':
                return [
                    { name: 'Dashboard', path: '/evaluator', icon: Home },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];
            case 'college_admin':
                return [
                    { name: 'Dashboard', path: '/college-admin', icon: Home },
                    { name: 'User Management', path: '/college-admin/users', icon: Users },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];
            case 'tpo':
                return [
                    { name: 'Dashboard', path: '/tpo', icon: Home },
                    { name: 'Placement Stats', path: '/tpo/stats', icon: BarChart },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];
            case 'system_admin':
                return [
                    { name: 'Dashboard', path: '/system-admin', icon: Home },
                    { name: 'System Settings', path: '/system-admin/settings', icon: Settings },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];

            default:
                return [];
        }
    };

    const links = getLinks(user?.role) || [];

    if (!user) {
        return null; // Don't render sidebar if user is not loaded
    }

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary-600">InternPortal</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )
                            }
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {link.name}
                        </NavLink>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center mb-4">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/'; // Force full reload to reset state/theme
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
