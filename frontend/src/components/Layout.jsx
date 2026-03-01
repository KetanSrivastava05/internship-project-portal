import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
                    {/* Max width container for page content */}
                    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
