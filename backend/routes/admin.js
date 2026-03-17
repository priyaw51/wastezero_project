const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/role");

// Protect all admin routes
router.use(auth);
router.use(authorizeRoles("admin"));

router.get("/users", adminController.getUsers);
router.put("/suspend/:userId", adminController.suspendUser);
router.put("/unsuspend/:userId", adminController.unsuspendUser);
router.get("/logs", adminController.getLogs);
router.get("/logs/download", adminController.downloadLogs);

module.exports = router;