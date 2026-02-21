const Opportunity = require('../models/Opportunity');

const createOpportunity = async (req, res, next) => {

    try {
        // ensure user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        // only NGO or admin can create
        if (req.user.role !== "ngo" && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Only NGO/Admin can create opportunity" });
        }

        const opportunity = await Opportunity.create({
            ngo_id: req.user.id,
            ...req.body
        });

        res.status(201).json({ success: true, data: opportunity });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOpportunities = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find()
            .populate("ngo_id", "name email role")
            .sort({ createdAt: -1 });

        res.json(opportunities);
    } catch (err) {
        next(err);
    }
};

const getMyOpportunities = async (req, res, next) => {
    try {
        const opportunities = await Opportunity.find({
            ngo_id: req.user.id
        }).sort({ createdAt: -1 });

        res.json({ success: true, data: opportunities });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found"
            });
        }

        if (
            opportunity.ngo_id.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }
        const updated = await Opportunity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ success: true, data: updated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteOpportunity = async (req, res, next) => {
    try {
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(404).json({
                success: false,
                message: "Opportunity not found"
            });
        }

        await opportunity.deleteOne();

        res.status(200).json({
            success: true,
            message: "Opportunity deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOpportunity,
    getOpportunities,
    getMyOpportunities,
    updateOpportunity,
    deleteOpportunity
};
