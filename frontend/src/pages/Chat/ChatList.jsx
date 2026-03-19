import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import { initiateSocketConnection } from '../../services/socketService';

const createMockConversations = (user) => {
    const displayName = user?.name || 'Community Partner';

    return [
        {
            id: `${user?._id || 'me'}_partner1`,
            name: 'GreenCycle Hub',
            lastMessage: 'Thanks for scheduling the pickup!',
            timestamp: new Date().toISOString(),
            unreadCount: 2
        }
    ];
};

const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatList = ({ selectedRoomId, onSelectRoom }) => {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load conversations
    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:3000/api/chat/conversations/list', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = res.data?.data || [];
                setConversations(data);
            } catch (err) {
                console.error(err);
                setConversations(createMockConversations(user));
            } finally {
                setLoading(false);
            }
        };
        if (user) load();
    }, [user]);

    // Clear unread when opened
    useEffect(() => {
        if (selectedRoomId) {
            setConversations(prev =>
                prev.map(c =>
                    c.id === selectedRoomId ? { ...c, unreadCount: 0 } : c
                )
            );
        }
    }, [selectedRoomId]);

    // Socket for real-time messages
    useEffect(() => {
        if (!user?._id) return;

        const socket = initiateSocketConnection(user._id);

        socket.on('receive_message', (msg) => {
            setConversations(prev =>
                prev.map(conv =>
                    conv.id === msg.roomId
                        ? {
                            ...conv,
                            lastMessage: msg.content,
                            timestamp: msg.createdAt,
                            unreadCount: msg.roomId === selectedRoomId ? 0 : conv.unreadCount + 1
                        }
                        : conv
                )
            );
        });

        return () => socket.disconnect();
    }, [user, selectedRoomId]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-full">
            {conversations.map(conv => (
                <div
                    key={conv.id}
                    onClick={() => onSelectRoom(conv.id)}
                    className={`p-3 cursor-pointer ${selectedRoomId === conv.id ? 'bg-green-100' : ''}`}
                >
                    <div className="flex justify-between">
                        <h4 className="font-semibold">{conv.name}</h4>
                        <span className="text-xs">{formatTime(conv.timestamp)}</span>
                    </div>
                    <p className="text-sm">{conv.lastMessage}</p>

                    {conv.unreadCount > 0 && (
                        <span className="text-xs bg-green-600 text-white px-2 rounded">
                            {conv.unreadCount}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatList;