const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2 },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        password: { type: String, required: true, minlength: 6 },
        course: { type: String, required: true, trim: true },
        age: { type: Number, required: true, min: 1, max: 120 }
    },
    { timestamps: true }
);

module.exports = studentSchema;
