const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            senderId: req.user._id,
            receiverId,
            content
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: req.user._id, receiverId: userId },
                { senderId: userId, receiverId: req.user._id }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get list of conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all unique users the current user has exchanged messages with
        const messages = await Message.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }]
        }).sort({ createdAt: -1 }); // Get latest first

        const userIds = new Set();
        messages.forEach(msg => {
            if (msg.senderId.toString() !== req.user._id.toString()) userIds.add(msg.senderId.toString());
            if (msg.receiverId.toString() !== req.user._id.toString()) userIds.add(msg.receiverId.toString());
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name email role');

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    getConversations
};
