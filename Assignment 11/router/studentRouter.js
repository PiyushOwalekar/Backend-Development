const express = require('express');
const bcrypt = require('bcryptjs');
const Student = require('../model/studentModel');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, course, age } = req.body;
        if (typeof password !== 'string' || password.length === 0) {
            return res.status(400).json({ message: 'Password is required' });
        }
        const student = await Student.create({
            name,
            email,
            password: await bcrypt.hash(password, 12),
            course,
            age
        });
        res.status(201).json({
            message: 'Student registered successfully',
            student: { id: student.id, name: student.name, email: student.email, course: student.course, age: student.age }
        });
    } catch (error) {
        const status = error.name === 'ValidationError' || error.code === 11000 ? 400 : 500;
        res.status(status).json({ message: 'Unable to register student', error: error.message });
    }
});

module.exports = router;
