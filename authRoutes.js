const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. REGISTER (SIGNUP) API
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check karo ki user pehle se registered toh nahi hai
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email!" });
        }

        // Password ko encrypt (hash) karo security ke liye
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user banao
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        res.status(201).json({ message: "User registered successfully!", userId: user._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check karo user database mein hai ya nahi
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password!" });
        }

        // Password match karo
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Email or Password!" });
        }

        // JWT Token generate karo
        const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY_123', { expiresIn: '1d' });

        res.json({
            message: "Login Successful!",
            token,
            name: user.name,
            email: user.email,
            role: user.role
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;