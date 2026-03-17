const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const { generateCSV } = require("../utils/reportGenerator");
const path = require("path");

//  Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Suspend user
const suspendUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status === "suspended") {
            return res.status(400).json({ message: "User already suspended" });
        }

        user.status = "suspended";
        await user.save();

        await AdminLog.create({
            admin_id: req.user.id,
            action: "SUSPEND_USER",
            target_id: userId,
        });

        res.json({ message: "User suspended successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Unsuspend user
const unsuspendUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status === "active") {
            return res.status(400).json({ message: "User is already active" });
        }

        user.status = "active";
        await user.save();

        await AdminLog.create({
            admin_id: req.user.id,
            action: "UNSUSPEND_USER",
            target_id: userId,
        });

        res.json({ message: "User unsuspended successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Get admin logs
const getLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find()
            .populate("admin_id", "name email")
            .populate("target_id", "name email")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Download logs as CSV
const downloadLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find();

        const filePath = path.join(__dirname, "../logs.csv");

        generateCSV(logs, filePath);

        res.download(filePath, "admin_logs.csv");

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getUsers, suspendUser, unsuspendUser, getLogs, downloadLogs };