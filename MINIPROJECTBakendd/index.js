const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 9000;

const filePath = path.join(__dirname, "data.json");

app.get("/employees", (req, res) => {

    console.log (req)

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            console.log("FILE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to read employee data"
            });
        }

        try {
            const employees = JSON.parse(data);

            res.status(200).json({
                success: true,
                message: "Employees fetched successfully",
                count: employees.length,
                data: employees
            });

        } catch (error) {
            console.log("JSON ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to read employee data"
            });
        }
    });
});


app.get("/employees/:id", (req, res) => {

    fs.readFile(filePath, "utf8", (err, data) => {

        if (err) {
            console.log("FILE ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to read employee data"
            });
        }

        try {
            const employees = JSON.parse(data);

            const id = parseInt(req.params.id);

            const employee = employees.find(emp => emp.id === id);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Employee not found"
                });
            }

            res.status(200).json({
                success: true,
                data: employee
            });

        } catch (error) {
            console.log("JSON ERROR:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to read employee data"
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
