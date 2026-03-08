import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const ChatWindow = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load previous messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/chat/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setMessages(response.data.data);
                }
            } catch (err) {
                setError('Failed to load messages');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (roomId) {
            loadMessages();
        }
    }, [roomId]);

    // Socket connection
    useEffect(() => {
        if (!user || !roomId) return;

        // Connect to socket
        socketRef.current = io('http://localhost:3000', {
            auth: {
                token: localStorage.getItem('token')
            }
        });

        const socket = socketRef.current;

        // Join room
        socket.emit('join_room', { roomId });

        // Listen for messages
        socket.on('receive_message', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Listen for notifications
        socket.on('new_notification', (notification) => {
            // Handle notifications if needed
            console.log('Notification:', notification);
        });

        return () => {
            socket.disconnect();
        };
    }, [user, roomId]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socketRef.current) return;

        const messageData = {
            roomId,
            content: newMessage.trim()
        };

        socketRef.current.emit('send_message', messageData);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    if (!user) {
        return (
            <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-screen w-full transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 flex flex-col overflow-hidden">
                    {/* Chat Header */}
                    <div className={`px-6 py-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Chat</h1>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Room: {roomId}</p>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading messages...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className={`text-center p-4 rounded-lg ${isDarkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                <p>{error}</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const isSent = message.sender === user._id;
                                return (
                                    <div
                                        key={index}
                                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                isSent
                                                    ? 'bg-green-600 text-white'
                                                    : isDarkMode
                                                        ? 'bg-gray-700 text-gray-200'
                                                        : 'bg-gray-200 text-gray-800'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <p className={`text-xs mt-1 ${isSent ? 'text-green-100' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {formatTimestamp(message.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className={`px-6 py-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim()}
                                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                                    newMessage.trim()
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatWindow;