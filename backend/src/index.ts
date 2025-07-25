import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import farmerRoutes from './routes/farmerRoutes';
import { testConnection } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务 - 用于提供上传的头像图片
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/farmer', farmerRoutes);

app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Rice Platform Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'API端点不存在'
  });
});

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

const startServer = async () => {
  try {
    const isDbConnected = await testConnection();
    if (!isDbConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();