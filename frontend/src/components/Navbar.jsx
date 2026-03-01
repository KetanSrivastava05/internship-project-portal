import React, { Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { LogOut, User as UserIcon, Bell, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/');
            window.location.href = '/';
        }
    };

    if (!user) return null;

    // Get an initial for the avatar
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-slate-200 bg-white/70 px-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1">
                {/* Mobile menu trigger could go here if needed */}
                {/* <button type="button" className="-m-2.5 p-2.5 text-slate-700 lg:hidden" onClick={onMenuClick}>
                    <span className="sr-only">Open sidebar</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">

                {/* Mock Notification Button */}
                <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5 outline-none">
                        <span className="sr-only">Open user menu</span>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 font-semibold shadow-sm">
                            {initial}
                        </div>
                        <span className="hidden lg:flex lg:items-center">
                            <span className="ml-4 text-sm font-medium leading-6 text-slate-900 dark:text-slate-100" aria-hidden="true">
                                {user?.name}
                            </span>
                            <ChevronDown className="ml-2 h-4 w-4 text-slate-400" aria-hidden="true" />
                        </span>
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-50 mt-2.5 w-48 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-slate-900/5 focus:outline-none dark:bg-slate-900 dark:ring-slate-800">
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        to="/profile"
                                        className={cn(
                                            active ? 'bg-slate-50 dark:bg-slate-800' : '',
                                            'flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200'
                                        )}
                                    >
                                        <UserIcon className="mr-3 h-4 w-4" />
                                        Your Profile
                                    </Link>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={handleLogout}
                                        className={cn(
                                            active ? 'bg-slate-50 dark:bg-slate-800' : '',
                                            'flex w-full items-center px-4 py-2 text-left text-sm text-red-600 dark:text-red-400'
                                        )}
                                    >
                                        <LogOut className="mr-3 h-4 w-4" />
                                        Sign out
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Navbar;
