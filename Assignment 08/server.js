require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userRouter');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment8';

app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'Assignment 8 user API is running' }));
app.use('/api/users', userRouter);

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
        app.listen(port, () => console.log(`Assignment 8 server running at http://localhost:${port}`));
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exitCode = 1;
    }
}

if (require.main === module) startServer();

module.exports = { app, startServer };
