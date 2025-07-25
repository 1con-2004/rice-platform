import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { FarmerModel } from '../models/Farmer';

export const register = async (req: Request, res: Response) => {
  try {
    const { account, password, confirmPassword } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        success: false,
        message: '账号和密码不能为空'
      });
    }

    if (!confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '确认密码不能为空'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次密码不一致'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      });
    }

    const accountRegex = /^[\u4e00-\u9fa5a-zA-Z0-9_]{2,20}$|^1[3-9]\d{9}$/;
    if (!accountRegex.test(account)) {
      return res.status(400).json({
        success: false,
        message: '账号格式不正确，请使用手机号或2-20位字符的用户名'
      });
    }

    const existingFarmer = await FarmerModel.findByAccount(account);
    if (existingFarmer) {
      return res.status(409).json({
        success: false,
        message: '账号已存在'
      });
    }

    const farmerId = await FarmerModel.create({ account, password });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: farmerId,
        account
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { account, password } = req.body;

    if (!account || !password) {
      return res.status(400).json({
        success: false,
        message: '账号和密码不能为空'
      });
    }

    const farmer = await FarmerModel.findByAccount(account);
    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误'
      });
    }

    if (farmer.status === 0) {
      return res.status(403).json({
        success: false,
        message: '账号已被禁用，请联系管理员'
      });
    }

    const isPasswordValid = await FarmerModel.validatePassword(password, farmer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '账号或密码错误'
      });
    }

    const token = jwt.sign(
      { id: farmer.id, account: farmer.account },
      process.env.JWT_SECRET || 'rice_platform_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        farmer: {
          id: farmer.id,
          account: farmer.account
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // 简单的退出登录响应
    // 在实际项目中，可以考虑实现JWT黑名单机制
    res.json({
      success: true,
      message: '退出登录成功'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};