const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const { getNotifications } = require("../controllers/notificationController");

router.use(auth);

router.get("/", getNotifications);

module.exports = router;