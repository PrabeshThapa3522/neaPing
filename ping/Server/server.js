import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()); // Add helmet for security

// Custom key generator for rate limiter
const customKeyGenerator = (req) => {
    // Use a combination of IP address and a unique identifier (e.g., User-Agent or custom header)
    const userAgent = req.headers["user-agent"] || "unknown";
    const ip = req.ip || req.connection.remoteAddress;
    return `${ip}-${userAgent}`;
};

// Rate limiter for login and signup
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 15, // Limit each unique key to 15 requests per windowMs
    keyGenerator: customKeyGenerator, // Use custom key generator
    message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
    },
});

// Apply rate limiter to auth routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);


app.use("/api/auth", authRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/user", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

