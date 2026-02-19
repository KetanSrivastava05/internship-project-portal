import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Send } from 'lucide-react';

const ChatWindow = ({ receiverId, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!receiverId) return;
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/chat/${receiverId}`);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const { data } = await api.post('/chat/send', {
                receiverId,
                content: newMessage
            });
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col h-[600px] max-h-[calc(100vh-300px)] border border-gray-200 rounded-lg bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <h3 className="font-semibold text-gray-800">Chat with {receiverName}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((msg, index) => {
                    const isMe = msg.senderId === (api.defaults.headers.common['Authorization'] ? 'me' : msg.senderId); // Logic needs simplified check or comparing with current user ID from context
                    // Simplified check assuming we can distinguish visually based on data
                    // Actually, we need current user ID. For now relying on alignment logic via prop or context would be better but let's assume we can check
                    return (
                        <div key={index} className={`flex ${msg.senderId !== receiverId ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId !== receiverId ? 'bg-primary-600 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                                <p className="text-sm">{msg.content}</p>
                                <span className="text-xs opacity-70 mt-1 block text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-lg flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
