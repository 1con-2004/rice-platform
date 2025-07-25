import express from 'express';
import FarmerController from '../controllers/farmerController';
import { authenticateToken } from '../middleware/auth';
import upload, { handleUploadError } from '../middleware/upload';

const router = express.Router();

// 更新农户档案信息
router.put('/profile', authenticateToken, FarmerController.updateProfile);

// 上传头像
router.post('/avatar', 
  authenticateToken, 
  upload.single('avatar'), 
  handleUploadError,
  FarmerController.uploadAvatar
);

export default router;