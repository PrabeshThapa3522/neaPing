import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 // Delete User
export const deleteUser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

// Update User (Edit)
export const updateUser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      // const { username, phoneNumber, role } = req.body;
      const { username, phoneNumber } = req.body;

      user.username = username || user.username;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      // user.role = role || user.role;

      const updatedUser = await user.save();
      res.json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};
