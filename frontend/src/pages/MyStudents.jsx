import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { MessageSquare, FileText } from 'lucide-react';

const MyStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/faculty/my-students');
            setStudents(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Mentored Students</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                    <div key={student._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center text-primary-600 font-bold text-xl">
                                {student.userId?.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{student.userId?.name}</h3>
                                <p className="text-sm text-gray-500">{student.userId?.email}</p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                            <Link to={`/chat/${student.userId._id}`} className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                                <MessageSquare size={16} className="mr-1" /> Chat
                            </Link>
                            <Link to={`/faculty/reports?studentId=${student.userId._id}`} className="flex items-center text-sm text-gray-600 hover:text-primary-600">
                                <FileText size={16} className="mr-1" /> View Reports
                            </Link>
                        </div>
                    </div>
                ))}
                {students.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        You have no mentored students yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStudents;
