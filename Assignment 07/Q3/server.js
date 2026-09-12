const express = require("express");

const app = express();

const PORT = 3000;


app.get("/profile/:id", (req, res) => {

    const id = req.params.id;
    const name = req.query.name;
    const course = req.query.course;

    res.send(`
        Student ID: ${id}<br>
        Name: ${name}<br>
        Course: ${course}
    `);

});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});