const express = require('express');
const bcrypt = require('bcryptjs');
const Teacher = require('../model/teacherModel');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, subject } = req.body;
        if (typeof password !== 'string' || password.length === 0) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const teacher = await Teacher.create({
            name,
            email,
            password: await bcrypt.hash(password, 12),
            subject
        });
        res.status(201).json({
            message: 'Teacher registered successfully',
            teacher: { id: teacher.id, name: teacher.name, email: teacher.email, subject: teacher.subject }
        });
    } catch (error) {
        const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;
        res.status(status).json({ message: 'Unable to register teacher', error: error.message });
    }
});

module.exports = router;
