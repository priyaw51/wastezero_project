const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
    title: String,
    description: String,
    date: String,
    duration: String,   // 👈 ADD THIS LINE
    location: String
});

module.exports = mongoose.model("Opportunity", opportunitySchema);
