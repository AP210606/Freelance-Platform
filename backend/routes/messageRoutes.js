const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessagesForContract
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Private routes for messages
router.post('/', protect, sendMessage);
router.get('/contract/:contractId', protect, getMessagesForContract);

module.exports = router;