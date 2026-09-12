const express = require("express");

const app = express();

const PORT = 3000;



app.get("/search", (req, res) => {

    const name = req.query.name;
    const course = req.query.course;


    if (!name && !course) {

        res.send("No search data provided");

    } else {

        res.send(`
            Name: ${name}<br>
            Course: ${course}`);
    }
});


app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});