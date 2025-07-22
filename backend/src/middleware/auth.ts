import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { FarmerModel } from '../models/Farmer';

export interface AuthRequest extends Request {
  farmer?: {
    id: number;
    account: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rice_platform_secret_key_2024') as any;
    
    const farmer = await FarmerModel.findById(decoded.id);
    if (!farmer) {
      return res.status(401).json({ error: '用户不存在或已被禁用' });
    }

    req.farmer = {
      id: farmer.id!,
      account: farmer.account
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ error: '无效的访问令牌' });
  }
};