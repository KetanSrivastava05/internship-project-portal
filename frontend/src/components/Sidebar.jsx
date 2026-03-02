import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, Briefcase, FileText, Award, Users, BarChart, Settings,
    MessageSquare, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const getLinks = (role) => {
        switch (role) {
            case 'student': return [
                { name: 'Dashboard', path: '/student', icon: Home },
                { name: 'Internships', path: '/student/internships', icon: Briefcase },
                { name: 'Applications', path: '/student/applications', icon: FileText },
                { name: 'Reports', path: '/student/reports', icon: BarChart },
                { name: 'Request Mentor', path: '/student/request-mentor', icon: Users },
                { name: 'My Mentor', path: '/student/my-mentor', icon: MessageSquare },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            case 'company': return [
                { name: 'Dashboard', path: '/company', icon: Home },
                { name: 'Post Internship', path: '/company/post-internship', icon: Briefcase },
                { name: 'Applications', path: '/company/applications', icon: Users },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            case 'faculty': return [
                { name: 'Dashboard', path: '/faculty', icon: Home },
                { name: 'Requests', path: '/faculty/requests', icon: Users },
                { name: 'My Students', path: '/faculty/students', icon: Users },
                { name: 'Reports', path: '/faculty/reports', icon: FileText },
                { name: 'Projects', path: '/faculty/projects', icon: Briefcase },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            case 'tpo': return [
                { name: 'Dashboard', path: '/tpo', icon: Home },
                { name: 'Stats', path: '/tpo/stats', icon: BarChart },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            case 'college_admin': return [
                { name: 'Dashboard', path: '/college-admin', icon: Home },
                { name: 'Users', path: '/college-admin/users', icon: Users },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            case 'system_admin': return [
                { name: 'Dashboard', path: '/sysadmin', icon: Home },
                { name: 'Profile', path: '/profile', icon: Settings },
            ];
            default: return [];
        }
    };

    const links = getLinks(user?.role) || [];

    if (!user) return null;

    return (
        <motion.div
            animate={{ width: isCollapsed ? 80 : 260 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="bg-secondary-950 text-white min-h-screen flex flex-col relative z-50 border-r border-secondary-800"
        >
            <div className="flex items-center justify-between p-6 h-20">
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div
                            key="logo-full"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-2 overflow-hidden whitespace-nowrap"
                        >
                            <div className="w-8 h-8 rounded-lg bg-primary-600 shadow-glow flex-shrink-0" />
                            <span className="text-xl font-extrabold tracking-tight text-white">InternPortal</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="logo-icon"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 rounded-lg bg-primary-600 shadow-glow mx-auto"
                        />
                    )}
                </AnimatePresence>
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-secondary-800 rounded-full border border-secondary-700 flex items-center justify-center text-secondary-400 hover:text-white hover:bg-secondary-700 hover:scale-110 transition-all z-50"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative',
                                    isActive
                                        ? 'bg-primary-600/10 text-primary-400'
                                        : 'text-secondary-400 hover:bg-secondary-900 hover:text-white'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={clsx("h-5 w-5 flex-shrink-0", isCollapsed ? "mx-auto" : "mr-3", isActive ? "text-primary-500" : "text-secondary-500 group-hover:text-primary-400")} />
                                    <AnimatePresence mode="wait">
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                                            >
                                                {link.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-secondary-800">
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 overflow-hidden"
                        >
                            <div className="flex items-center px-2">
                                <div className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center text-white font-bold text-lg">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="ml-3 overflow-hidden">
                                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                    <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider truncate">{user?.role?.replace('_', ' ')}</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <button
                    onClick={() => {
                        logout();
                        window.location.href = '/';
                    }}
                    className={clsx(
                        "flex items-center font-semibold text-sm rounded-xl transition-all duration-200 overflow-hidden",
                        isCollapsed ? "justify-center w-12 h-12 mx-auto bg-secondary-900 text-secondary-400 hover:text-red-400 hover:bg-red-500/10" : "w-full px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                    )}
                >
                    <LogOut className={clsx("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="whitespace-nowrap"
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
