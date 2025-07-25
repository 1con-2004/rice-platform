import { Request, Response } from 'express';
import FarmerProfileModel from '../models/FarmerProfile';
import { FarmerModel } from '../models/Farmer';

interface AuthRequest extends Request {
  user?: {
    id: number;
    account: string;
  };
}

class UserController {
  // 获取用户信息和农户档案
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;

      // 获取用户信息和农户档案
      const userWithProfile = await FarmerProfileModel.getUserWithProfile(userId);
      
      if (!userWithProfile) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 格式化响应数据
      const response = {
        success: true,
        data: {
          userInfo: {
            id: userWithProfile.id,
            account: userWithProfile.account,
            created_at: userWithProfile.created_at,
            updated_at: userWithProfile.updated_at,
            status: userWithProfile.status,
            roles: userWithProfile.roles
          },
          farmerProfile: {
            id: userWithProfile.profile_id,
            user_id: userWithProfile.id,
            name: userWithProfile.name,
            phone: userWithProfile.phone,
            location: userWithProfile.location,
            farm_info: userWithProfile.farm_info,
            avatar_url: userWithProfile.avatar_url,
            created_at: userWithProfile.profile_created_at,
            updated_at: userWithProfile.profile_updated_at
          }
        }
      };

      res.json(response);
    } catch (error) {
      console.error('获取用户档案失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }

  // 修改密码
  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;

      // 参数验证
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: '请提供旧密码和新密码'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: '新密码至少需要6位字符'
        });
      }

      // 获取当前用户信息
      const user = await FarmerModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      // 验证旧密码（明文比较）
      if (user.password !== oldPassword) {
        return res.status(400).json({
          success: false,
          message: '当前密码不正确'
        });
      }

      // 更新密码（明文存储）
      const updateSuccess = await FarmerModel.updatePassword(userId, newPassword);
      
      if (!updateSuccess) {
        return res.status(500).json({
          success: false,
          message: '密码更新失败'
        });
      }

      res.json({
        success: true,
        message: '密码修改成功'
      });
    } catch (error) {
      console.error('修改密码失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器内部错误'
      });
    }
  }
}

export default UserController;