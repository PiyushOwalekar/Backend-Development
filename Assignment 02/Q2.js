// Assignment 2: HTML Response Server
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <html>
            <head><title>Student Portal</title></head>
            <body>
                <h1>Student Portal</h1>
                <p>Name: Yash</p>
                <p>Course: Full Stack Dev</p>
                <p>College: ITM</p>
                <p>Welcome to my project.</p>
            </body>
        </html>
    `);
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});