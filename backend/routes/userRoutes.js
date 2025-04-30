import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, admin, registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);

export default router;