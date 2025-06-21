// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User model
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    description: {
        type: String,
        required: true,
        minlength: 20
    },
    budget: {
        type: Number,
        min: 0,
        default: 0
    },
    deadline: {
        type: Date,
        required: false // Optional deadline
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'completed', 'cancelled'], // Define possible project statuses
        default: 'open'
    },
    acceptedBidId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid', // References the Bid model once a bid is accepted
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);