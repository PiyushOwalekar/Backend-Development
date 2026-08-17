// Assignment 5: Personal Portfolio Server
const http = require('http');

const nav = `
    <nav>
        <a href="/">Home</a> |
        <a href="/about">About Me</a> |
        <a href="/skills">Skills</a> |
        <a href="/projects">Projects</a> |
        <a href="/contact">Contact</a>
    </nav>
`;

const server = http.createServer((req, res) => {
    console.log('Request received for:', req.url); // helps debug routing

    res.writeHead(200, { 'Content-Type': 'text/html' });

    if (req.url === '/') {
        res.end(`<h1>Home</h1>${nav}<p>Welcome to my personal portfolio website.</p>`);
    } else if (req.url === '/about') {
        res.end(`<h1>About Me</h1>${nav}<p>I am a B.Tech CSE student passionate about coding, AI, and web development. I love building projects, learning new technologies, and exploring creative ideas.
</p>`);
    } else if (req.url === '/skills') {
        res.end(`<h1>Skills</h1>${nav}<p>Python, JavaScript, React, HTML, CSS, SQL, PostgreSQL, AI, Prompt Engineering, UI/UX Design, Git & GitHub, Networking, Problem Solving.</p>`);
    } else if (req.url === '/projects') {
        res.end(`<h1>Projects</h1>${nav}<p>Personal Portfolio.</p>`);
    } else if (req.url === '/contact') {
        res.end(`<h1>Contact Details</h1>${nav}<p>Email: owlekar@gmail.com</p>`);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});