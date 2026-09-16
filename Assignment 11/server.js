require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const teacherRouter = require('./router/teacherRouter');
const studentRouter = require('./router/studentRouter');

const app = express();
const port = process.env.ASSIGNMENT11_PORT || 3003;
const mongoUri = process.env.ASSIGNMENT11_MONGO_URI || 'mongodb://127.0.0.1:27017/assignment11';

app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'Assignment 11 registration API is running' }));
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
        app.listen(port, () => console.log(`Assignment 11 server running at http://localhost:${port}`));
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exitCode = 1;
    }
}

if (require.main === module) startServer();

module.exports = { app, startServer };
