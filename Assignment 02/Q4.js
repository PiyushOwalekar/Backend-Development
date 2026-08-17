// Assignment 4: Route Handling Server
const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    if(req.url === '/home'){
        res.write('this is home page...')
        res.end()
    } else if (req.url == '/contact') {
        res.end('this is contact page...')
    } else {
        res.end('Page not found...')
    }
})

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})