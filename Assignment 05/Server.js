const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to Home Page');
});

app.get('/home', (req, res) => {
    res.send('Welcome to Home Page');
});

app.get('/about', (req, res) => {
    res.send('This is About Page');
});

app.get('/contact', (req, res) => {
    res.send('This is Contact Page');
});

app.get('/user/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello ${name}`);
});

app.get('/user', (req, res) => {
    res.send('hello i am Satvik!');
});

app.get('/product/:id/:category', (req, res) => {
    const { id, category } = req.params;
    res.send(`Product ID: ${id}, Category: ${category}`);
});

app.get('/search', (req, res) => {
    const name = req.query.name || 'Samay';
    const role = req.query.role || 'developer';
    res.send(`Name: ${name}, Role: ${role}`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});