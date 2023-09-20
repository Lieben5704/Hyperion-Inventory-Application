const mongoose = require('mongoose');

// Define the schema for the 'User' model
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true  // Username must be unique
    },
    email: { 
        type: String,
        required: true,
        unique: true  // Email must be unique
    },
    password: {
        type: String,
        required: true  // Password is required
    },
    role: {
        type: String,
        enum: ['end-user', 'admin'],  // Role must be one of 'end-user' or 'admin'
        default: 'end-user'           // Default role is 'end-user'
    }
});

// Create and export the 'User' model using the schema
module.exports = mongoose.model('User', UserSchema);
