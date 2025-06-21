// backend/models/Contract.js
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date // When the project was completed/approved
    },
    status: {
        type: String,
        enum: ['in_progress', 'completed', 'approved', 'disputed'], // Status of the contract
        default: 'in_progress'
    },
    // Optional: Add fields for payment status later if integrating Stripe
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Contract', contractSchema);