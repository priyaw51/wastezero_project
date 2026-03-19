import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
=======
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initiateSocketConnection, disconnectSocket, getSocket } from '../../services/socketService';
import chatService from '../../services/chatService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { FaPaperPlane, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a

const ChatWindow = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();
<<<<<<< HEAD
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
=======

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Derive receiverId from roomId: [user1, user2].sort().join('_')
    const userIds = roomId ? roomId.split('_') : [];
    const receiverId = userIds.find((id) => id !== user?._id);

    // Auto-scroll to latest message
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
<<<<<<< HEAD
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
                if (response.data.success && Array.isArray(response.data.data)) {
                    // Normalize message shape for UI
                    const apiMessages = response.data.data.map((m) => ({
                        ...m,
                        senderId: m.sender_id?._id || m.sender_id || m.sender,
                        timestamp: m.createdAt || m.timestamp
                    }));
                    setMessages(apiMessages);
                }
            } catch (err) {
                setError('Failed to load messages');
                console.error(err);
=======
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (!user?._id || !roomId) return;

        // 1. Fetch old message history
        const fetchHistory = async () => {
            try {
                const data = await chatService.getMessages(roomId);
                if (data.success && data.data) {
                    setMessages(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a
            } finally {
                setLoading(false);
            }
        };

<<<<<<< HEAD
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

        // Mark messages as read for this room
        socket.emit('mark_messages_read', { roomId, userId: user._id });

        // Listen for messages
        socket.on('receive_message', (message) => {
            const normalized = {
                ...message,
                senderId: message.sender_id?._id || message.sender_id || message.sender,
                timestamp: message.createdAt || message.timestamp
            };
            setMessages((prev) => [...prev, normalized]);
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
        if (!newMessage.trim() || !socketRef.current || !user) return;

        const [userA, userB] = String(roomId).split('_');
        const senderId = user._id;
        const receiverId = senderId === userA ? userB : userA;

        const messageData = {
            roomId,
            senderId,
            receiverId,
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
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
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
                        const senderId = message.senderId || message.sender_id?._id || message.sender_id || message.sender;
                        const isSent =
                            senderId && user?._id
                                ? String(senderId) === String(user._id)
                                : false;
                        const ts = message.timestamp || message.createdAt;

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
                                    <p
                                        className={`text-xs mt-1 ${
                                            isSent
                                                ? 'text-green-100'
                                                : isDarkMode
                                                    ? 'text-gray-400'
                                                    : 'text-gray-500'
                                        }`}
                                    >
                                        {formatTimestamp(ts)}
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
=======
        fetchHistory();

        // 2. Initialize socket
        const socket = initiateSocketConnection(user._id);

        // Join room and tell the backend we are currently reading these messages
        socket.emit('join_room', { roomId });
        socket.emit('mark_messages_read', { roomId, userId: user._id });

        // 3. Listen for incoming messages
        const messageHandler = (messageData) => {
            // Only add if it belongs to current room
            if (messageData.roomId === roomId) {
                setMessages((prev) => {
                    // Prevent duplicates if already added locally
                    if (prev.find(m => m._id === messageData._id)) return prev;
                    return [...prev, messageData];
                });
            }
        };

        socket.on('receive_message', messageHandler);

        // On unmount: remove listeners only (Layout will handle actual disconnection)
        return () => {
            if (socket) {
                socket.off('receive_message', messageHandler);
            }
        };
    }, [user, roomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();
        if (!trimmed || !user?._id || !receiverId) return;

        const socket = getSocket();
        if (socket && socket.connected) {
            // Send via socket. The server handles saving it and broadcasting it back.
            socket.emit('send_message', {
                roomId,
                senderId: user._id,
                receiverId,
                content: trimmed
            });
            setNewMessage('');
        } else {
            // Fallback via REST API if disconnected
            try {
                const msgResponse = await chatService.sendMessage({
                    roomId,
                    receiver_id: receiverId,
                    content: trimmed
                });
                if (msgResponse.success) {
                    setMessages(prev => [...prev, msgResponse.data]);
                    setNewMessage('');
                }
            } catch (err) {
                console.error("Failed to send message via API:", err);
                alert("Failed to send message. Please reconnect.");
            }
        }
    };

    const formatTime = (isoString) => {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 w-full h-full p-0 md:p-6 overflow-hidden">
            <div className={`flex flex-col h-full w-full max-w-4xl mx-auto md:rounded-2xl shadow-sm border-0 md:border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

                {/* Chat Header */}
                <div className={`flex items-center gap-4 p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <FaArrowLeft />
                    </button>
                    <div className="flex items-center gap-3">
                        <FaUserCircle size={40} className="text-gray-400" />
                        <div>
                            <h2 className="font-semibold text-lg leading-tight">
                                {(() => {
                                    const otherMsg = messages.find(
                                        (m) => String(m.sender_id?._id || m.sender_id || m.sender) === String(receiverId) || String(m.receiver_id?._id || m.receiver_id || m.receiver) === String(receiverId)
                                    );
                                    if (otherMsg) {
                                        const r1 = otherMsg.sender_id;
                                        const r2 = otherMsg.receiver_id;
                                        if (String(r1?._id || r1) === String(receiverId) && r1?.name) return r1.name;
                                        if (String(r2?._id || r2) === String(receiverId) && r2?.name) return r2.name;
                                    }
                                    return "Conversation";
                                })()}
                            </h2>
                            <p className="text-xs text-green-500 font-medium">Secured Room</p>
                        </div>
                    </div>
                </div>

                {/* Message History */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-gray-400 animate-pulse">Loading messages...</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                            <span className="text-4xl mb-3">💬</span>
                            <h3 className="text-lg font-medium">No messages yet</h3>
                            <p className="text-sm">Send a message to start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const senderId = msg.sender_id?._id || msg.sender_id || msg.sender;
                            const isMe = String(senderId) === String(user._id);

                            return (
                                <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm flex flex-col
                                                ${isMe
                                            ? 'bg-green-600 text-white rounded-tr-sm'
                                            : isDarkMode
                                                ? 'bg-gray-700 text-gray-100 rounded-tl-sm'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'}`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <span className={`text-[10px] self-end mt-1 ${isMe ? 'text-green-200' : 'text-gray-400'}`}>
                                            {msg.createdAt ? formatTime(msg.createdAt) : 'Just now'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 rounded-full px-5 py-3 outline-none transition-colors border
                                        ${isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                    : 'bg-gray-100 border-transparent focus:bg-white focus:border-green-500 text-gray-800'}`}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="h-12 w-12 flex items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shrink-0"
                        >
                            <FaPaperPlane className="relative right-0.5" />
                        </button>
                    </form>
                </div>

>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default ChatWindow;
=======
export default ChatWindow;
>>>>>>> eaa806068fdff2f2c8b837cf0a8f99347969326a
