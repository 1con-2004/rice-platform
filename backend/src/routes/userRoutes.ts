import express from 'express';
import UserController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// 获取用户信息和农户档案
router.get('/profile', authenticateToken, UserController.getProfile);

// 修改密码
router.put('/password', authenticateToken, UserController.changePassword);

export default router;