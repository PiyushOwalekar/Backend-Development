const express = require("express");

const app = express();

const PORT = 3000;



app.get("/student/:id", (req, res) => {

    const id = req.params.id;

    res.send(`Student ID: ${id}`);

});



app.listen(PORT, () => {

    console.log(`Server is running on http://localhost:${PORT}`);

});