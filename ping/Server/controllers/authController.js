import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body; 

  try {
    const user = await User.findOne({ username }); 
    if (!user) return res.status(400).json({ message: "Invalid Username or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "10h" });
     // Generate JWT Token (Include role in the payload)
     const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      message: "User Logged in Successfully",
      token,
      role: user.role, // Send role to the frontend
    });
  } catch (error) {
    console.error("Login Error:", error); // Log the actual error
    res.status(500).json({ message: "Server error" });
  }
};


// Register User
export const signupUser = async (req, res) => {
  try {
    const { username, phoneNumber, password, role } = req.body;

    // Validate required fields
    if (!username || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user (relying on unique index for username)
    const user = new User({ username, phoneNumber, password: hashedPassword, role });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        username: user.username,
        role: user.role,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error) {
    // Modified error responses
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
        error: "DUPLICATE_USERNAME"
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message,
        error: "VALIDATION_ERROR"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "SERVER_ERROR"
    });
  }
};



 



