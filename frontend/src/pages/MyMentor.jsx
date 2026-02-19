import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { MessageSquare, User } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';

const MyMentor = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMentor, setActiveMentor] = useState(null);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const { data: profileData } = await api.get('/users/profile');
                if (profileData.profile) {
                    const loadedMentors = [];
                    // Handle legacy single mentor
                    if (profileData.profile.mentorId) {
                        loadedMentors.push({
                            ...profileData.profile.mentorId,
                            type: 'Legacy Mentor' // or infer from role if available
                        });
                    }
                    // Handle new multiple mentors array
                    if (profileData.profile.mentors && profileData.profile.mentors.length > 0) {
                        profileData.profile.mentors.forEach(m => {
                            if (m.mentorId) {
                                // Avoid duplicates if legacy and new coexist (shouldn't happen with new logic but safe to check)
                                if (!loadedMentors.some(existing => existing._id === m.mentorId._id)) {
                                    loadedMentors.push({
                                        ...m.mentorId,
                                        type: m.mentorType === 'faculty' ? 'Internal Mentor' : 'External Mentor'
                                    });
                                }
                            }
                        });
                    }
                    setMentors(loadedMentors);
                    if (loadedMentors.length > 0) {
                        setActiveMentor(loadedMentors[0]);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch mentor', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    if (loading) return <div>Loading mentor details...</div>;

    if (mentors.length === 0) {
        return (
            <div className="p-6 text-center">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Mentor Assigned</h2>
                <p className="text-gray-500 mt-2">You haven't been assigned a mentor yet. Please request one from the "Request Mentor" page.</p>
            </div>
        );
    }

    return (
        <div className="p-6 h-[calc(100vh-100px)] flex gap-6">
            {/* Mentors List Sidebar */}
            <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="font-bold text-lg text-gray-800">My Mentors</h2>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {mentors.map(mentor => (
                        <div
                            key={mentor._id}
                            onClick={() => setActiveMentor(mentor)}
                            className={`p-3 rounded-md cursor-pointer flex items-center gap-3 transition-colors ${activeMentor?._id === mentor._id
                                    ? 'bg-primary-50 border border-primary-200'
                                    : 'hover:bg-gray-50 border border-transparent'
                                }`}
                        >
                            <div className="bg-primary-100 rounded-full w-10 h-10 flex items-center justify-center text-primary-600 font-bold text-sm">
                                {mentor.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className={`font-semibold text-sm ${activeMentor?._id === mentor._id ? 'text-primary-700' : 'text-gray-900'}`}>
                                    {mentor.name}
                                </h3>
                                <p className="text-xs text-gray-500">{mentor.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                {activeMentor ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare size={20} />
                                Chat with {activeMentor.name}
                            </h3>
                            <span className="text-xs text-gray-500">{activeMentor.email}</span>
                        </div>
                        <div className="flex-1 p-4 overflow-hidden relative">
                            <ChatWindow
                                key={activeMentor._id} // Force re-mount when mentor changes
                                receiverId={activeMentor._id}
                                receiverName={activeMentor.name}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-4" />
                        <p>Select a mentor to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyMentor;
