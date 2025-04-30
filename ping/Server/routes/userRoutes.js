import express from "express";
import { getUsers, deleteUser, updateUser} from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js"; // Import auth middleware

const router = express.Router();

router.get("/",protectUser, getUsers); 
router.delete("/:id",protectUser, deleteUser); 
router.put("/:id", protectUser, updateUser); 

export default router;
