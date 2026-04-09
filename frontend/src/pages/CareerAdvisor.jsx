import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FadeUp } from '../components/ui/AnimatedWrappers';

const QUESTIONS = [
    { key: 'projects', text: "How many academic or personal projects have you completed?", type: 'number', min: 0 },
    { key: 'internships', text: "How many internships have you completed?", type: 'number', min: 0 },
    { key: 'certifications', text: "How many certifications have you received?", type: 'number', min: 0 },
    { key: 'hs_per', text: "What was your High School percentage?", type: 'number', min: 0, max: 100 },
    { key: 'uni_gpa', text: "What is your current University GPA (out of 10)?", type: 'number', min: 0, max: 10 },
    { key: 'soft_skills', text: "How would you rate your soft skills on a scale of 0 to 10?", type: 'number', min: 0, max: 10 },
    { key: 'field_study', text: "What is your field of study?", type: 'select', options: ['Business', 'Computer Science', 'Engineering', 'Law', 'Mathematics', 'Medicine'] },
    { key: 'target_salary', text: "Finally, what is your target salary (in ₹)?", type: 'number', min: 0 }
];

const CareerAdvisor = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { sender: 'bot', text: `Hi ${user?.name || ''}! I am the K10 Career Advisor 🤖. I can estimate your expected salary and give you personalized advice to reach your career goals. Shall we begin?` }
    ]);
    const [currentStep, setCurrentStep] = useState(-1); // -1: Intro, 0-N: Questions, N+1: Processing
    const [answers, setAnswers] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleStart = () => {
        setMessages(prev => [...prev, { sender: 'user', text: "Yes, let's begin!" }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'bot', text: QUESTIONS[0].text }]);
            setCurrentStep(0);
        }, 500);
    };

    const handleSend = async (e) => {
        e?.preventDefault();
        
        if (!inputValue && inputValue !== 0) return;
        
        const q = QUESTIONS[currentStep];
        
        // Add User Message
        setMessages(prev => [...prev, { sender: 'user', text: inputValue.toString() }]);
        
        // Save Answer
        const newAnswers = { ...answers, [q.key]: inputValue };
        setAnswers(newAnswers);
        setInputValue('');

        // Next Step
        const nextStep = currentStep + 1;
        if (nextStep < QUESTIONS.length) {
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'bot', text: QUESTIONS[nextStep].text }]);
                setCurrentStep(nextStep);
                if (QUESTIONS[nextStep].type === 'select') {
                    setInputValue(QUESTIONS[nextStep].options[0]);
                } else {
                    setInputValue('');
                }
            }, 600);
        } else {
            setCurrentStep(nextStep);
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: 'bot', text: "Thank you! Let me analyze your profile and predict your salary..." }]);
                fetchAdvice(newAnswers);
            }, 600);
        }
    };

    const fetchAdvice = async (stats) => {
        setLoading(true);
        try {
            const { data } = await api.post('/ai/advise', stats);
            
            setMessages(prev => [
                ...prev, 
                { sender: 'bot', text: `💰 **Estimated Salary Range:** ₹${Math.round(data.expected_salary_min).toLocaleString()} – ₹${Math.round(data.expected_salary_max).toLocaleString()}` },
                { sender: 'bot', text: data.advice }
            ]);
        } catch (error) {
            console.error("Failed to fetch AI advice", error);
            setMessages(prev => [...prev, { sender: 'bot', text: `Sorry, I encountered an error while processing your request: ${error.response?.data?.message || error.message}. Please check if the model backend is accessible.` }]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to format text that might have markdown (bolding, lists)
    const formatMessageText = (text) => {
        return text.split('\n').map((line, i) => {
            // Very basic markdown bolding replacement
            let formattedLine = line;
            const parts = formattedLine.split(/(\*\*.*?\*\*)/g);
            return (
                <div key={i} className="mb-1">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </div>
            );
        });
    };

    return (
        <FadeUp className="h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Sparkles size={24} className="animate-pulse" />
                </div>
                <div>
                    <h1 className="text-2xl font-extrabold text-secondary-900 tracking-tight">AI Career Advisor</h1>
                    <p className="text-sm font-medium text-secondary-500">Powered by Mistral-7B & Deep Learning</p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-sm border border-secondary-200 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary-50/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-end max-w-[80%] space-x-2">
                                {msg.sender === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mb-1 shadow-md">
                                        <Bot size={16} />
                                    </div>
                                )}
                                <div 
                                    className={`p-4 rounded-2xl shadow-sm ${
                                        msg.sender === 'user' 
                                            ? 'bg-primary-600 text-white rounded-br-sm' 
                                            : 'bg-white border border-secondary-200 text-secondary-800 rounded-bl-sm'
                                    }`}
                                >
                                    <div className="text-sm leading-relaxed">{formatMessageText(msg.text)}</div>
                                </div>
                                {msg.sender === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-secondary-300 flex items-center justify-center text-secondary-700 mb-1">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-end max-w-[80%] space-x-2">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white mb-1 shadow-md">
                                    <Bot size={16} />
                                </div>
                                <div className="p-4 rounded-2xl bg-white border border-secondary-200 text-secondary-500 rounded-bl-sm flex space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-secondary-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-secondary-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-secondary-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-secondary-200">
                    {currentStep === -1 ? (
                        <button 
                            onClick={handleStart}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5 mt-2"
                        >
                            Yes, let's begin! 🚀
                        </button>
                    ) : currentStep < QUESTIONS.length ? (
                        <form onSubmit={handleSend} className="flex space-x-3 items-end">
                            <div className="flex-1">
                                {QUESTIONS[currentStep].type === 'select' ? (
                                    <select
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        className="w-full bg-secondary-50 border border-secondary-200 text-secondary-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 outline-none transition-all"
                                    >
                                        <option value="" disabled>Select an option</option>
                                        {QUESTIONS[currentStep].options.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="number"
                                        min={QUESTIONS[currentStep].min}
                                        max={QUESTIONS[currentStep].max}
                                        step={QUESTIONS[currentStep].type === 'number' && QUESTIONS[currentStep].key.includes('salary') ? "1000" : "0.1"}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your answer..."
                                        required
                                        className="w-full bg-secondary-50 border border-secondary-200 text-secondary-900 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3.5 outline-none transition-all"
                                    />
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={inputValue === ''}
                                className="bg-primary-600 text-white p-3.5 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send size={20} className="ml-1" />
                            </button>
                        </form>
                    ) : (
                        <div className="py-3 text-center text-sm font-medium text-secondary-500">
                            Chat sequence completed. Refresh the page to start over.
                        </div>
                    )}
                </div>
            </div>
        </FadeUp>
    );
};

export default CareerAdvisor;
