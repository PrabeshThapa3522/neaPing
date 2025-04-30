import express from "express";
import { getIp, createIp, updateIp, deleteIp } from "../controllers/ipController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getIp);
router.post("/", protect, createIp);
router.put("/:id", protect, updateIp);
router.delete("/:id", protect, deleteIp);

export default router;



