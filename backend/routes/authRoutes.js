const express = require("express");
const { login, register, verifyOTP } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);

router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});

router.get("/me", verifyToken, (req, res) => {
    res.json(req.user);
});

module.exports = router;