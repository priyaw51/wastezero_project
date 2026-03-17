const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/users", adminController.getUsers);
router.put("/suspend/:userId", adminController.suspendUser);
router.get("/logs", adminController.getLogs);
router.get("/logs/download", adminController.downloadLogs);

module.exports = router;