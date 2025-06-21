const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Passwords will be hashed, minlength applies to original password
    },
    role: {
        type: String,
        enum: ['client', 'freelancer'], // User can either be a client or a freelancer
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema for a User model in a freelance platform backend.
// It includes fields for name, email, password, role (client or freelancer), and createdAt timestamp.