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
                    { name: 'Dashboard', path: '/sysadmin', icon: Home },
                    { name: 'My Profile', path: '/profile', icon: Users },
                ];

            default:
                return [];
        }
    };

    const links = getLinks(user?.role) || [];

    if (!user) {
        return null;
    }

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        InternPortal
                    </h1>
                </div>
            </div>

            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <div className="text-xs font-semibold leading-6 text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                            Overview
                        </div>
                        <ul role="list" className="-mx-2 space-y-1">
                            {links.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <li key={link.name}>
                                        <NavLink
                                            to={link.path}
                                            className={({ isActive }) =>
                                                clsx(
                                                    isActive
                                                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-semibold'
                                                        : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:bg-slate-800/50',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-all duration-200'
                                                )
                                            }
                                        >
                                            <Icon
                                                className={clsx(
                                                    'h-5 w-5 shrink-0 transition-colors',
                                                    // For active state we can rely on parent text color, but force icon styling if needed
                                                )}
                                                aria-hidden="true"
                                            />
                                            {link.name}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>

                    {/* We removed the explicit logout button from the bottom of the sidebar
                        since it's now securely located in the top Navbar profile dropdown. */}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
