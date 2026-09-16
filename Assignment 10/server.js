require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const userRouter = require('./router/userRouter');
const { verifyFirebaseConnection } = require('./config/firebase');

const app = express();
const port = process.env.ASSIGNMENT10_PORT || 3002;

app.use(express.json());
app.get('/', (_req, res) => res.json({ message: 'Assignment 10 Firestore API is running' }));
app.use('/api/users', userRouter);

async function startServer() {
    try {
        await verifyFirebaseConnection();
        app.listen(port, () => console.log(`Assignment 10 server running at http://localhost:${port}`));
    } catch (error) {
        console.error('Firebase connection failed:', error.message);
        process.exitCode = 1;
    }
}

if (require.main === module) startServer();

module.exports = { app, startServer };
