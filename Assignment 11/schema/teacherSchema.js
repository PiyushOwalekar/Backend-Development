const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2 },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { type: String, required: true, minlength: 6 },
        subject: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

module.exports = teacherSchema;
