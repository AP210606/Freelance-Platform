const Message = require('../models/Message');
const Contract = require('../models/Contract'); // To ensure messages are tied to active contracts

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private (Client or Freelancer)
const sendMessage = async (req, res) => {
    const { contractId, content } = req.body;

    if (!contractId || !content) {
        return res.status(400).json({ message: 'Please provide contract ID and message content' });
    }

    try {
        const contract = await Contract.findById(contractId);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Ensure the logged-in user is part of this contract
        const isParticipant = contract.clientId.toString() === req.user.id.toString() ||
                              contract.freelancerId.toString() === req.user.id.toString();
        if (!isParticipant) {
            return res.status(403).json({ message: 'You are not authorized to send messages for this contract' });
        }

        // Determine receiverId based on sender's role
        const receiverId = req.user.id.toString() === contract.clientId.toString()
                           ? contract.freelancerId
                           : contract.clientId;

        const newMessage = await Message.create({
            contractId,
            senderId: req.user.id,
            receiverId,
            content
        });

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

// @desc    Get all messages for a specific contract
// @route   GET /api/messages/contract/:contractId
// @access  Private (Client or Freelancer who are part of the contract)
const getMessagesForContract = async (req, res) => {
    try {
        const contract = await Contract.findById(req.params.contractId);
        if (!contract) {
            return res.status(404).json({ message: 'Contract not found' });
        }

        // Ensure the logged-in user is part of this contract
        const isParticipant = contract.clientId.toString() === req.user.id.toString() ||
                              contract.freelancerId.toString() === req.user.id.toString();
        if (!isParticipant) {
            return res.status(403).json({ message: 'You are not authorized to view messages for this contract' });
        }

        const messages = await Message.find({ contractId: req.params.contractId })
                                      .populate('senderId', 'name')
                                      .populate('receiverId', 'name')
                                      .sort('timestamp'); // Sort by time to show conversation flow
        res.status(200).json(messages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching messages' });
    }
};

module.exports = {
    sendMessage,
    getMessagesForContract
};