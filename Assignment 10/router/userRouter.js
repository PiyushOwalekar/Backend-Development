const express = require('express');
const userSchema = require('../schema/userSchema');
const { db, admin } = require('../config/firebase');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error, value } = userSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: error.details.map((detail) => detail.message)
        });
    }

    try {
        const document = await db.collection('users').add({
            ...value,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        res.status(201).json({ message: 'User stored successfully', id: document.id });
    } catch (databaseError) {
        res.status(500).json({ message: 'Unable to store user', error: databaseError.message });
    }
});

module.exports = router;
