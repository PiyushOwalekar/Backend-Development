const express = require("express");

const app = express();
const PORT = 3000;



// ASSIGNMENT 1


const router = express.Router();


// Router-Level Logger Middleware

function routerLogger(req, res, next) {

    const timestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

    console.log(
        `Assignment 1: ${req.method} ${req.originalUrl} ${timestamp}`
    );

    next();
}


// Apply middleware only to router

router.use(routerLogger);


// Assignment 1 Routes

router.get("/students", (req, res) => {
    res.send("Students List");
});


router.get("/courses", (req, res) => {
    res.send("Courses List");
});


router.get("/faculty", (req, res) => {
    res.send("Faculty List");
});


// Mount router

app.use("/api", router);




// ==========================================
// ASSIGNMENT 2: REQUEST LOGGER MIDDLEWARE
// ==========================================


// Custom Logger Middleware

function logger(req, res, next) {

    const timestamp = new Date()
        .toISOString()
        .replace("T", " ")
        .slice(0, 19);

    console.log(
        `Assignment 2: ${req.method} ${req.url} ${timestamp}`
    );

    next();
}


// Apply only to Assignment 2 routes

app.use("/assignment2", logger);


// Assignment 2 Routes

app.get("/assignment2", (req, res) => {
    res.send("Welcome to Home Page");
});


app.get("/assignment2/about", (req, res) => {
    res.send("About Us");
});


app.get("/assignment2/contact", (req, res) => {
    res.send("Contact Information");
});




// ==========================================
// ASSIGNMENT 3: RESPONSE TIME MIDDLEWARE
// ==========================================


// Response Time Middleware

function responseTimeLogger(req, res, next) {

    const startTime = Date.now();


    res.on("finish", () => {

        const endTime = Date.now();

        const responseTime = endTime - startTime;

        console.log(
            `Assignment 3: ${req.method} ${req.url} - ${responseTime} ms`
        );

    });


    next();
}


// Apply only to Assignment 3 routes

app.use("/assignment3", responseTimeLogger);


// Assignment 3 Routes

app.get("/assignment3", (req, res) => {
    res.send("Home Page");
});


app.get("/assignment3/products", (req, res) => {
    res.send("Product List");
});


app.get("/assignment3/users", (req, res) => {
    res.send("User List");
});




// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});