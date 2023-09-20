const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();


// Controller function to register a new user
exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, role, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email
        });
        
        console.log("Saving user to the database...");
        await newUser.save();
        console.log("User registered successfully");
        
        res.status(201).json({ message: 'User registered successfully', user: newUser.toObject({ virtuals: true, versionKey: false }) });
    } catch (error) {
        next(error);
    }
};


// Controller function to authenticate and log in a user
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const secret = process.env.JWT_SECRET || 'matthewSecrets';
        const token = jwt.sign({ userId: user.id, role: user.role, isAdmin: user.role === 'admin' }, secret, { expiresIn: '1h' });


        res.json({ token, userId: user.id, role: user.role });
    } catch (error) {
        next(error);
    }
};


// Controller function to get a list of all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();  // Assuming you have a User model
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users.' });
    }
};


// Controller function to get a user by their ID
exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id); // Change this line
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching the user', error: error.message });
    }
};

// Controller function to create a new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Controller function to update an existing user by their ID
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send("User not found");
        res.json(user);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Controller function to delete a user by their ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).send("User not found");
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Middleware to check if a user has admin privileges
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // continue to the next middleware/route handler
    } else {
        res.status(403).json({ message: 'Access denied' });
    }
};

