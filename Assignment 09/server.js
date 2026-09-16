require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./router/userRouter');

const app = express();
const port = process.env.ASSIGNMENT9_PORT || 3001;
const mongoUri = process.env.ASSIGNMENT9_MONGO_URI || 'mongodb://127.0.0.1:27017/assignment9';

app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'Assignment 9 user API is running' }));
app.use('/api/users', userRouter);

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
        app.listen(port, () => console.log(`Assignment 9 server running at http://localhost:${port}`));
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exitCode = 1;
    }
}

if (require.main === module) startServer();

module.exports = { app, startServer };
