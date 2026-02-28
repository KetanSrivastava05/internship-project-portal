import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const SysadminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 space-y-8 min-h-screen bg-gray-50/50 dark:bg-gray-900/50"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Administration</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Manage users, configure roles, and monitor system-wide audit logs.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`py-3 px-4 flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Users className="w-4 h-4" />
                    User Management
                    {activeTab === 'users' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                        />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('audit')}
                    className={`py-3 px-4 flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'audit' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Activity className="w-4 h-4" />
                    Audit Logs
                    {activeTab === 'audit' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                        />
                    )}
                </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'users' && <UserManagementPanel />}
            {activeTab === 'audit' && <AuditLogsPanel />}

        </motion.div>
    );
};

const UserManagementPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal state for editing user
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [newStatus, setNewStatus] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/sysadmin/users?page=${page}`);
            setUsers(data.users);
            setTotalPages(data.pages);
        } catch (error) {
            toast.error('Failed to load users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const openEditModal = (user) => {
        setEditingUser(user);
        setNewRole(user.role);
        setNewStatus(user.status);
        setIsEditModalOpen(true);
    };

    const handleSaveUser = async () => {
        try {
            const { data } = await api.put(`/sysadmin/users/${editingUser._id}`, {
                role: newRole,
                status: newStatus
            });
            toast.success(data.message || 'User updated successfully');
            setIsEditModalOpen(false);
            setEditingUser(null);
            fetchUsers(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading users...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >Previous</button>
                    <span>Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >Next</button>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">Edit User</h3>
                            <div className="mt-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                                    <input type="text" disabled value={editingUser?.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm disabled:bg-gray-100 p-2 border" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                        <option value="student">Student</option>
                                        <option value="company">Company</option>
                                        <option value="faculty">Faculty</option>
                                        <option value="external_mentor">External Mentor</option>
                                        <option value="evaluator">Evaluator</option>
                                        <option value="college_admin">College Admin</option>
                                        <option value="tpo">Training & Placement Officer</option>
                                        <option value="system_admin">System Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="items-center px-4 py-3 mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AuditLogsPanel = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/sysadmin/audit-logs?page=${page}`);
            setLogs(data.logs);
            setTotalPages(data.pages);
        } catch (error) {
            toast.error('Failed to load audit logs');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Audit Logs</h2>
                <button onClick={fetchLogs} className="text-gray-500 hover:text-indigo-600">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 dark:text-gray-400">Loading logs...</p>
            ) : logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No audit logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map((log) => (
                                <tr key={log._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {log.userId?.name || 'Unknown User'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-mono text-xs">{log.action}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {log.targetEntity} ({log.targetId})
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-x-auto">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
                    >Previous</button>
                    <span className="text-sm">Page {page} of {totalPages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50 bg-white"
                    >Next</button>
                </div>
            )}
        </div>
    );
};

export default SysadminDashboard;
