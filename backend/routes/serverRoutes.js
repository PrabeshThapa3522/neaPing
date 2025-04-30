import express from 'express';
import {
  getServers,
  getServersByProvince,
  addServer,
  deleteServer,
  refreshServerStatus,
  refreshProvinceServers,
} from '../controllers/serverController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getServers).post(protect, addServer);
router.route('/province/:provinceId').get(protect, getServersByProvince);
router.route('/refresh/province/:provinceId').post(protect, refreshProvinceServers);
router.route('/:id').delete(protect, deleteServer);
router.route('/:id/refresh').post(protect, refreshServerStatus);

export default router;