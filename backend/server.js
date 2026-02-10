import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { verifyToken } from "./middleware/authMiddleware.js"; // NEW

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/protected", verifyToken, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user,
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
