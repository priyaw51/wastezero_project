import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { initiateSocketConnection, getSocket } from '../../services/socketService';
import chatService from '../../services/chatService';
import { FaPaperPlane, FaUserCircle, FaArrowLeft } from 'react-icons/fa';

const ChatWindow = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Get receiverId from roomId
    const userIds = roomId ? roomId.split('_') : [];
    const receiverId = userIds.find((id) => id !== user?._id);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!user?._id || !roomId) return;

        // Fetch chat history
        const fetchHistory = async () => {
            try {
                const data = await chatService.getMessages(roomId);
                if (data.success) {
                    setMessages(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch chat history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Init socket
        const socket = initiateSocketConnection(user._id);

        socket.emit('join_room', { roomId });
        socket.emit('mark_messages_read', { roomId, userId: user._id });

        const messageHandler = (msg) => {
            if (msg.roomId === roomId) {
                setMessages((prev) => {
                    if (prev.find(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
            }
        };

        socket.on('receive_message', messageHandler);

        return () => {
            socket.off('receive_message', messageHandler);
        };
    }, [user, roomId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmed = newMessage.trim();

        if (!trimmed || !user?._id || !receiverId) return;

        const socket = getSocket();

        if (socket && socket.connected) {
            socket.emit('send_message', {
                roomId,
                senderId: user._id,
                receiverId,
                content: trimmed
            });
            setNewMessage('');
        } else {
            try {
                const res = await chatService.sendMessage({
                    roomId,
                    receiver_id: receiverId,
                    content: trimmed
                });

                if (res.success) {
                    setMessages(prev => [...prev, res.data]);
                    setNewMessage('');
                }
            } catch (err) {
                console.error("Send failed:", err);
            }
        }
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex-1 w-full h-full p-0 md:p-6 overflow-hidden">
            <div className={`flex flex-col h-full w-full max-w-4xl mx-auto rounded-2xl shadow-sm border 
                ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

                {/* Header */}
                <div className="flex items-center gap-4 p-4 border-b">
                    <button onClick={() => navigate(-1)}>
                        <FaArrowLeft />
                    </button>

                    <FaUserCircle size={40} />

                    <h2 className="font-semibold">Chat</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : messages.length === 0 ? (
                        <p>No messages yet</p>
                    ) : (
                        messages.map((msg, i) => {
                            const senderId = msg.sender_id?._id || msg.sender_id || msg.sender;
                            const isMe = String(senderId) === String(user._id);

                            return (
                                <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`px-4 py-2 rounded-lg max-w-xs 
                                        ${isMe ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                                        <p>{msg.content}</p>
                                        <span className="text-xs">
                                            {msg.createdAt && formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
                    <input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded px-4 py-2"
                        placeholder="Type message..."
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 rounded">
                        <FaPaperPlane />
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ChatWindow;