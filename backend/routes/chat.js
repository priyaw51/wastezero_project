const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Message = require('../models/Message');

// All chat routes require authentication
router.use(auth);

// GET /api/chat/:roomId - Fetch message history for a room
router.get('/:roomId', async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const messages = await Message.find({ roomId })
            .populate('sender_id', 'name')
            .populate('receiver_id', 'name')
            .sort({ createdAt: 1 })   // oldest first
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: messages.length,
            page,
            data: messages
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/chat/conversations/list - Get all conversations for logged-in user
router.get('/conversations/list', async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get the latest message per unique room this user is part of
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: require('mongoose').Types.ObjectId.createFromHexString(userId) },
                        { receiver_id: require('mongoose').Types.ObjectId.createFromHexString(userId) }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$roomId',
                    lastMessage: { $first: '$$ROOT' }
                }
            },
            { $sort: { 'lastMessage.createdAt': -1 } }
        ]);

        // Populate sender/receiver names
        const Message2 = require('../models/Message');
        const populated = await Message2.populate(
            conversations.map(c => c.lastMessage),
            [
                { path: 'sender_id', select: 'name' },
                { path: 'receiver_id', select: 'name' }
            ]
        );

        // Count unread messages per room for this user
        const roomIds = conversations.map(c => c._id);
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    roomId: { $in: roomIds },
                    receiver_id: require('mongoose').Types.ObjectId.createFromHexString(userId),
                    isRead: false
                }
            },
            { $group: { _id: '$roomId', count: { $sum: 1 } } }
        ]);
        const unreadMap = {};
        unreadCounts.forEach(u => { unreadMap[u._id] = u.count; });

        const result = populated.map((msg, i) => ({
            roomId: conversations[i]._id,
            lastMessage: msg,
            unreadCount: unreadMap[conversations[i]._id] || 0
        }));

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
