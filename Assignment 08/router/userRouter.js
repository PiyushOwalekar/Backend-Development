const express = require('express');
const User = require('../model/userModel');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;
        res.status(status).json({ message: 'Unable to create user', error: error.message });
    }
});

router.get('/', async (_req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve users', error: error.message });
    }
});

module.exports = router;
