import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Activity, RefreshCw, MoreVertical, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

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
            <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`py-3 px-4 flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
                    className={`py-3 px-4 flex items-center gap-2 font-medium text-sm transition-colors relative ${activeTab === 'audit' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
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
        <Card className="border-none shadow-md">
            <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage user roles and disable accounts.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {users.map((user) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={user._id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge variant="outline" className="capitalize text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50">
                                                {user.role.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className="capitalize">
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openEditModal(user)}
                                                className="text-slate-500 hover:text-indigo-600"
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-medium text-slate-500">Page {page} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>

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
                            <div className="flex justify-end gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveUser}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
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
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>System Audit Logs</CardTitle>
                    <CardDescription>Immutable record of all administrative actions.</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={fetchLogs}>
                    <RefreshCw className={cn("h-4 w-4 text-slate-500", loading && "animate-spin")} />
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No logs found.</div>
                ) : (
                    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800 mt-4">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin User</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Target</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {new Date(log.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                                            {log.userId?.name || 'Unknown User'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="secondary" className="font-mono">{log.action}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                            {log.targetEntity} <span className="text-slate-400">({log.targetId.substring(0, 8)}...)</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <pre className="text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded-md border border-slate-100 dark:border-slate-800 max-w-xs overflow-x-auto">
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
                    <div className="flex justify-between items-center mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-medium text-slate-500">Page {page} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default SysadminDashboard;
