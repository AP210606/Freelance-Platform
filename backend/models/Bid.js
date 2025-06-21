// backend/models/Bid.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project', // References the Project model
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model (freelancer)
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    timeline: {
        type: String,
        required: true, // e.g., "7 days", "2 weeks"
        trim: true
    },
    message: {
        type: String,
        required: true,
        minlength: 10
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // Status of the bid
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Bid', bidSchema);
