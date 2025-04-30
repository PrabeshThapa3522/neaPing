import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["MD", "PA", "GM", "Admin"] } ,
});

// Define the model after the schema
const User = mongoose.model("User", userSchema); 

export default User;
