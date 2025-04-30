import mongoose from "mongoose";


const IpSchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  province: { type: String, required: true, unique: true },
  });


const Ip = mongoose.model("Ip", IpSchema);

export default Ip;




