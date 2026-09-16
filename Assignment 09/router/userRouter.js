const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/userModel');

const router = express.Router();

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

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
        res.json(await User.find().sort({ createdAt: -1 }));
    } catch (error) {
        res.status(500).json({ message: 'Unable to retrieve users', error: error.message });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid user ID' });

    try {
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;
        res.status(status).json({ message: 'Unable to update user', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid user ID' });

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Unable to delete user', error: error.message });
    }
});

module.exports = router;
