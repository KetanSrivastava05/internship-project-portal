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
import InternshipList from './components/InternshipList';
import StudentApplications from './components/StudentApplications';

import CompanyDashboard from './pages/CompanyDashboard';
import PostInternship from './pages/PostInternship';
import ManageApplications from './pages/ManageApplications';

import FacultyDashboard from './pages/FacultyDashboard';
import StudentReports from './pages/StudentReports';
import Profile from './pages/Profile';
import MentorshipRequests from './pages/MentorshipRequests';
import MyStudents from './pages/MyStudents';
import RequestMentor from './pages/RequestMentor';

import MyMentor from './pages/MyMentor';
import PostProject from './pages/PostProject';
import FacultyProjects from './pages/FacultyProjects';
import ProjectApplications from './pages/ProjectApplications';
import StudentProjectList from './pages/StudentProjectList';

import ExternalMentorDashboard from './pages/ExternalMentorDashboard';
import EvaluatorDashboard from './pages/EvaluatorDashboard';
import CollegeAdminDashboard from './pages/CollegeAdminDashboard';
import UserManagement from './pages/UserManagement';
import ChatWindow from './components/ChatWindow'; // Using as page for simplification? Or needs a wrapper.


// Wrapper for Chat Page to pass params or context
import { useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api/axios';
import { useState, useEffect } from 'react';

const ChatPage = () => {
    const { userId } = useParams();
    const { user } = useAuth();
    const [receiverName, setReceiverName] = useState('User');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                // Try to fetch user details if possible
                // For now, we'll use a generic name or you can add an endpoint to get user by ID
                setReceiverName('User');
            } catch (error) {
                console.error('Failed to fetch user name');
            } finally {
                setLoading(false);
            }
        };
        if (userId) {
            fetchUserName();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Chat</h1>
            <div className="max-w-4xl mx-auto">
                <ChatWindow receiverId={userId} receiverName={receiverName} />
            </div>
        </div>
    );
};

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
                    {/* Common Protected Routes - Accessible by all authenticated users */}
                    <Route element={<ProtectedRoute allowedRoles={['student', 'company', 'faculty', 'external_mentor', 'evaluator', 'college_admin', 'tpo', 'system_admin']} />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Student Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                        <Route path="/student" element={<StudentDashboard />} />
                        <Route path="/student/internships" element={<div className="p-8"><h1 className="text-2xl font-bold mb-6">Internships</h1><InternshipList /></div>} />
                        <Route path="/student/applications" element={<div className="p-8"><h1 className="text-2xl font-bold mb-6">My Applications</h1><StudentApplications /></div>} />
                        <Route path="/student/reports" element={<StudentReports />} />
                        <Route path="/student/request-mentor" element={<RequestMentor />} />
                        <Route path="/student/my-mentor" element={<MyMentor />} />
                        <Route path="/student/projects" element={<StudentProjectList />} />
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
                        <Route path="/faculty/reports" element={<StudentReports />} />
                        <Route path="/faculty/requests" element={<MentorshipRequests />} />
                        <Route path="/faculty/requests" element={<MentorshipRequests />} />
                        <Route path="/faculty/students" element={<MyStudents />} />
                        <Route path="/faculty/projects" element={<FacultyProjects />} />
                        <Route path="/faculty/projects/:projectId/applications" element={<ProjectApplications />} />
                        <Route path="/faculty/post-project" element={<PostProject />} />
                    </Route>

                    {/* Chat Route - Accessible to all authenticated users */}
                    <Route element={<ProtectedRoute allowedRoles={['student', 'company', 'faculty', 'external_mentor', 'evaluator', 'college_admin', 'tpo', 'system_admin']} />}>
                        <Route path="/chat/:userId" element={<ChatPage />} />
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['external_mentor']} />}>
                        <Route path="/external-mentor" element={<ExternalMentorDashboard />} />
                    </Route>

                    {/* Evaluator Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['evaluator']} />}>
                        <Route path="/evaluator" element={<EvaluatorDashboard />} />
                    </Route>

                    {/* College Admin Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['college_admin']} />}>
                        <Route path="/college-admin" element={<CollegeAdminDashboard />} />
                        <Route path="/college-admin/dashboard" element={<Navigate to="/college-admin" replace />} />
                        <Route path="/college-admin/users" element={<UserManagement />} />
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
