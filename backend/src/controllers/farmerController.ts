import { Request, Response } from 'express';
import FarmerProfileModel from '../models/FarmerProfile';

interface AuthRequest extends Request {
  user?: {
    id: number;
    account: string;
  };
}

class FarmerController {
  // 更新农户档案信息
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { name, phone, location, farm_info } = req.body;

      // 参数验证
      if (!name && !phone && !location && !farm_info) {
        return res.status(400).json({
          success: false,
          message: '请提供要更新的字段'
        });
      }

      // 手机号格式验证（如果提供了手机号）
      if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: '请输入正确的手机号码格式'
        });
      }

      // 检查农户档案是否存在
      const profileExists = await FarmerProfileModel.profileExists(userId);
      
      if (!profileExists) {
        // 如果档案不存在，创建新档案
        await FarmerProfileModel.createProfile({
          user_id: userId,
          name,
          phone,
          location,
          farm_info
        });
      } else {
        // 更新现有档案
        const updateSuccess = await FarmerProfileModel.updateProfile(userId, {
          name,
          phone,
          location,
          farm_info
        });

        if (!updateSuccess) {
          return res.status(500).json({
            success: false,
            message: '更新档案失败'
          });
        }
      }

      res.json({
        success: true,
        message: '档案更新成功'
      });
    } catch (error) {
      console.error('更新农户档案失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }

  // 上传头像
  static async uploadAvatar(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请选择要上传的图片文件'
        });
      }

      // 生成头像URL（这里使用相对路径，实际项目中应该是完整的URL）
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // 检查农户档案是否存在
      const profileExists = await FarmerProfileModel.profileExists(userId);
      
      if (!profileExists) {
        // 如果档案不存在，创建新档案
        await FarmerProfileModel.createProfile({
          user_id: userId,
          avatar_url: avatarUrl
        });
      } else {
        // 更新头像URL
        const updateSuccess = await FarmerProfileModel.updateAvatar(userId, avatarUrl);
        
        if (!updateSuccess) {
          return res.status(500).json({
            success: false,
            message: '头像更新失败'
          });
        }
      }

      res.json({
        success: true,
        message: '头像上传成功',
        data: {
          avatar_url: avatarUrl
        }
      });
    } catch (error) {
      console.error('上传头像失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }
}

export default FarmerController;