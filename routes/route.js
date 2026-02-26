const express = require("express");
const router = express.Router();
const Opportunity = require("../models/Opportunity");

// CREATE
router.post("/add", async (req, res) => {
    try {
        const opportunity = new Opportunity(req.body);
        await opportunity.save();
        res.json({ message: "Created Successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET ALL
router.get("/", async (req, res) => {
    try {
        const data = await Opportunity.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
