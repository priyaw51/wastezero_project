const Opportunity = require('../models/Opportunity');

// Create Opportunity
const createOpportunity = async (req, res, next) => {
  try {
    const opportunity = new Opportunity({
      ...req.body,
      ngo_id: req.user.id
    });

    const savedOpportunity = await opportunity.save();

    res.status(201).json(savedOpportunity);
  } catch (error) {
    next(error);
  }
};

// Get all Opportunities
const getOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find().populate(
      "ngo_id",
      "name email"
    );

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

// Get single opportunity
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// Get opportunities created by logged in NGO
const getMyOpportunities = async (req, res, next) => {
  try {
    const opportunities = await Opportunity.find({
      ngo_id: req.user.id
    });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

// Update Opportunity
const updateOpportunity = async (req, res, next) => {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(opportunity);
  } catch (error) {
    next(error);
  }
};

// Delete Opportunity
const deleteOpportunity = async (req, res, next) => {
  try {
    await Opportunity.findByIdAndDelete(req.params.id);

    res.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Apply to Opportunity (simple version)
const applyToOpportunity = async (req, res, next) => {
  try {
    res.json({ message: "Applied successfully" });
  } catch (error) {
    next(error);
  }
};

// Get applied opportunities
const getAppliedOpportunities = async (req, res, next) => {
  try {
    res.json([]);
  } catch (error) {
    next(error);
  }
};

// Get applicants
const getOpportunityApplicants = async (req, res, next) => {
  try {
    res.json([]);
  } catch (error) {
    next(error);
  }
};

// Search Opportunities
const searchOpportunities = async (req, res, next) => {
  try {
    const { title } = req.query;

    const opportunities = await Opportunity.find({
      title: { $regex: title, $options: "i" }
    });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
  getAppliedOpportunities,
  getOpportunityApplicants,
  searchOpportunities
};