const express = require('express');
const Message = require('../models/Message');
const auth = require('../middlewares/auth');

const router = express.Router();

// GET /api/chat/:roomId - Get message history for a room
router.get('/:roomId', auth, async (req, res) => {
    try {
        const { roomId } = req.params;        
        const userId = req.user.id;

        // Check if user is part of the room (roomId is user1_user2 sorted)
        const roomUsers = roomId.split('_');
        if (!roomUsers.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You are not part of this chat room'
            });
        }

        const messages = await Message.find({ roomId })
            .populate('sender', 'name email')
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: messages.map(msg => ({
                sender: msg.sender._id,
                content: msg.content,
                timestamp: msg.createdAt
            }))
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

module.exports = router;