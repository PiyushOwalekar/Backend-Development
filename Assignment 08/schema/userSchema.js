const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, minlength: 2 },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        age: { type: Number, required: true, min: 1, max: 120 },
        course: { type: String, required: true, trim: true }
    },
    { timestamps: true }
);

module.exports = userSchema;
