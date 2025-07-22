const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// 安全中间件
app.use(helmet());

// CORS配置 - 允许前端访问
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

// JSON解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Rice Platform Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API路由
console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('Auth routes loaded.');

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('数据库连接失败，服务器启动终止');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 服务器启动成功！`);
      console.log(`📡 端口: ${PORT}`);
      console.log(`🌐 健康检查: http://localhost:${PORT}/health`);
      console.log(`🔐 认证API: http://localhost:${PORT}/api/auth`);
      console.log(`📅 启动时间: ${new Date().toLocaleString()}\n`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();