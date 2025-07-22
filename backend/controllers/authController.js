const { pool } = require('../config/database');

// 用户注册
const register = async (req, res) => {
  const { account, password } = req.body;

  // 输入验证
  if (!account || !password) {
    return res.status(400).json({
      success: false,
      message: '账号和密码不能为空'
    });
  }

  if (account.length < 3 || account.length > 50) {
    return res.status(400).json({
      success: false,
      message: '账号长度必须在3-50个字符之间'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: '密码长度不能少于6个字符'
    });
  }

  try {
    // 检查用户是否已存在
    const [existingUser] = await pool.execute(
      'SELECT id FROM users WHERE account = ?',
      [account]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        message: '该账号已存在'
      });
    }

    // 插入新用户（明文存储密码）
    const [result] = await pool.execute(
      'INSERT INTO users (account, password, role) VALUES (?, ?, ?)',
      [account, password, 'farmer']
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: result.insertId,
        account: account,
        role: 'farmer'
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

// 用户登录
const login = async (req, res) => {
  const { account, password } = req.body;

  // 输入验证
  if (!account || !password) {
    return res.status(400).json({
      success: false,
      message: '账号和密码不能为空'
    });
  }

  try {
    // 查询用户
    const [users] = await pool.execute(
      'SELECT id, account, password, role, created_at FROM users WHERE account = ?',
      [account]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '账号不存在'
      });
    }

    const user = users[0];

    // 验证密码（明文比较）
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // 登录成功
    res.json({
      success: true,
      message: '登录成功',
      data: {
        id: user.id,
        account: user.account,
        role: user.role,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

module.exports = {
  register,
  login
};