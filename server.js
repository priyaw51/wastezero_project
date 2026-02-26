const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));   // IMPORTANT FOR YOUR STRUCTURE

let opportunities = [];
let idCounter = 1;

app.post("/opportunities", (req, res) => {
    const { title, description, location, date, duration } = req.body;

    const newOpportunity = {
        id: idCounter++,
        title,
        description,
        location,
        date,
        duration
    };

    opportunities.push(newOpportunity);
    res.json(newOpportunity);
});

app.get("/opportunities", (req, res) => {
    res.json(opportunities);
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
