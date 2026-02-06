import React from 'react';
import ThemeManager from './components/ThemeManager';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

import StudentDashboard from './pages/StudentDashboard';

import CompanyDashboard from './pages/CompanyDashboard';
import PostInternship from './pages/PostInternship';
import ManageApplications from './pages/ManageApplications';

import FacultyDashboard from './pages/FacultyDashboard';
import StudentReports from './pages/StudentReports';

// const CompanyDashboard = () => <div><h1 className="text-2xl font-bold mb-4">Company Dashboard</h1><p>Manage your internships and applicants.</p></div>;
const Unauthorized = () => <div className="p-10 text-center text-red-600">You do not have permission to view this page.</div>;

function App() {
    return (
        <>
            <ThemeManager />
            <Toaster position="top-right" />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Routes Wrapper */}
                <Route element={<Layout />}>

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                        <Route path="/student" element={<StudentDashboard />} />
                        <Route path="/student/reports" element={<StudentReports />} />
                        {/* Add more student routes here */}
                    </Route>

                    {/* Company Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['company']} />}>
                        <Route path="/company" element={<CompanyDashboard />} />
                        <Route path="/company/post-internship" element={<PostInternship />} />
                        <Route path="/company/applications" element={<ManageApplications />} />
                    </Route>

                    {/* Faculty Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
                        <Route path="/faculty" element={<FacultyDashboard />} />
                    </Route>

                    {/* External Mentor Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['external_mentor']} />}>
                        <Route path="/external-mentor" element={<div><h1 className="text-2xl font-bold">External Mentor Dashboard</h1><p>Mentoring interface coming soon.</p></div>} />
                    </Route>

                    {/* Evaluator Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['evaluator']} />}>
                        <Route path="/evaluator" element={<div><h1 className="text-2xl font-bold">Evaluator Dashboard</h1><p>Evaluation interface coming soon.</p></div>} />
                    </Route>

                    {/* College Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['college_admin']} />}>
                        <Route path="/college-admin" element={<div><h1 className="text-2xl font-bold">College Admin Dashboard</h1><p>Administration interface coming soon.</p></div>} />
                    </Route>

                    {/* TPO Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['tpo']} />}>
                        <Route path="/tpo" element={<div><h1 className="text-2xl font-bold">TPO Dashboard</h1><p>Placement management interface coming soon.</p></div>} />
                    </Route>

                    {/* System Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['system_admin']} />}>
                        <Route path="/system-admin" element={<div><h1 className="text-2xl font-bold">System Admin Dashboard</h1><p>System configuration coming soon.</p></div>} />
                    </Route>

                </Route>

                {/* Redirect root to Landing Page */}
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </>
    );
}

export default App;
