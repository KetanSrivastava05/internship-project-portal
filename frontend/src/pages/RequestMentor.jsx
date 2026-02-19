import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { User, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const RequestMentor = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [message, setMessage] = useState('');
    const [pendingRequests, setPendingRequests] = useState(new Set());
    const [filter, setFilter] = useState('all'); // 'all', 'internal', 'external'

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/mentorship/my-requests');
            // Handle both populated and non-populated mentorId
            const pending = new Set(
                data
                    .filter(r => r.status === 'pending' || r.status === 'accepted')
                    .map(r => {
                        // Handle both object and string IDs
                        const mentorId = r.mentorId?._id || r.mentorId;
                        return mentorId?.toString() || mentorId;
                    })
                    .filter(Boolean)
            );
            setPendingRequests(pending);
        } catch (error) {
            console.error("Could not fetch my requests", error);
        }
    };

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const [facultiesRes, externalMentorsRes] = await Promise.all([
                    api.get('/faculty/list'),
                    api.get('/external-mentor/list')
                ]);

                // Combine and mark mentor types
                const faculties = facultiesRes.data.map(f => ({ ...f, mentorType: 'faculty', typeLabel: 'Internal Mentor' }));
                const externalMentors = externalMentorsRes.data.map(e => ({ ...e, mentorType: 'external_mentor', typeLabel: 'External Mentor' }));
                
                setMentors([...faculties, ...externalMentors]);
            } catch (error) {
                console.error('Failed to fetch mentors list', error);
                toast.error('Failed to load mentors');
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
        fetchRequests();
    }, []);

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            await api.post('/mentorship/request', {
                mentorId: selectedMentor._id,
                mentorType: selectedMentor.mentorType,
                message
            });
            toast.success('Mentorship request sent successfully!');
            // Refetch requests to update the UI
            await fetchRequests();
            setSelectedMentor(null);
            setMessage('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send request');
        }
    };

    // Filter mentors based on selected filter
    const filteredMentors = mentors.filter(mentor => {
        if (filter === 'all') return true;
        if (filter === 'internal') return mentor.mentorType === 'faculty';
        if (filter === 'external') return mentor.mentorType === 'external_mentor';
        return true;
    });

    if (loading) return <div className="p-6">Loading mentors list...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Find a Mentor</h1>
                
                {/* Filter Buttons */}
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-500" />
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('internal')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                filter === 'internal'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Internal
                        </button>
                        <button
                            onClick={() => setFilter('external')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                filter === 'external'
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            External
                        </button>
                    </div>
                </div>
            </div>

            {filteredMentors.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    No {filter !== 'all' ? (filter === 'internal' ? 'internal' : 'external') : ''} mentors available.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMentors.map((mentor) => {
                        const isPending = pendingRequests.has(mentor._id.toString());
                        const isFaculty = mentor.mentorType === 'faculty';
                        
                        return (
                            <div key={mentor._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl mr-4">
                                        {mentor.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                isFaculty 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {isFaculty ? 'Internal' : 'External'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">{mentor.email}</p>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2 text-sm text-gray-600 mb-4">
                                    {isFaculty && mentor.profile && (
                                        <>
                                            <p><span className="font-medium">Department:</span> {mentor.profile.department || 'N/A'}</p>
                                            <p><span className="font-medium">Designation:</span> {mentor.profile.designation || 'N/A'}</p>
                                            {mentor.profile.subjectSpecialization?.length > 0 && (
                                                <p><span className="font-medium">Specialization:</span> {mentor.profile.subjectSpecialization.join(', ')}</p>
                                            )}
                                        </>
                                    )}
                                    {!isFaculty && mentor.profile && (
                                        <>
                                            {mentor.profile.companyName && (
                                                <p><span className="font-medium">Company:</span> {mentor.profile.companyName}</p>
                                            )}
                                            {mentor.profile.designation && (
                                                <p><span className="font-medium">Role:</span> {mentor.profile.designation}</p>
                                            )}
                                            {mentor.profile.domain && (
                                                <p><span className="font-medium">Domain:</span> {mentor.profile.domain}</p>
                                            )}
                                            {mentor.profile.expertise?.length > 0 && (
                                                <p><span className="font-medium">Expertise:</span> {mentor.profile.expertise.join(', ')}</p>
                                            )}
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedMentor(mentor)}
                                    disabled={isPending}
                                    className={`w-full mt-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                        ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'}`}
                                >
                                    {isPending ? (
                                        <>Request Sent</>
                                    ) : (
                                        <><Plus size={16} className="mr-2" /> Request Mentorship</>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {selectedMentor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setSelectedMentor(null)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-2">Request Mentorship from {selectedMentor.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {selectedMentor.mentorType === 'faculty' ? 'Internal Mentor (Faculty)' : 'External Mentor (Industry)'}
                        </p>
                        <form onSubmit={handleRequest}>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-primary-500 focus:border-primary-500"
                                rows="4"
                                placeholder="Why do you want this mentor to guide you?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            ></textarea>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMentor(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                                >
                                    Send Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestMentor;
