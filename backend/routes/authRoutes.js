import express from "express";
import { login, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});
router.get("/me", verifyToken, (req, res) => {
    res.json(req.user);
});
export default router;
