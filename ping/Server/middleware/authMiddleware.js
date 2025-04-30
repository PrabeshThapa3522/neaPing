// Export protect as the default export and verifyToken as a named export
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET;
import Meeting from "../models/ipModel.js";
import User from "../models/userModel.js";

export const protectUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = await User.findById(decoded.userId).select("-password"); // Fetch user details

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware/controller
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const protect = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.userId;

    // Check if the meeting exists if meetingId is provided in the request
    const { meetingId } = req.params;
    if (meetingId) {
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
    }

    next(); // Proceed
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// Named export for verifyToken
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");  // Extract JWT token

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);  // Verify token
    req.user = decoded;  // Store entire decoded payload in req.user
    next();  // Allow the request to proceed
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
};



