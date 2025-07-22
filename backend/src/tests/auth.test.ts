import request from 'supertest';
import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/authRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new farmer successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'testuser',
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('注册成功');
      expect(response.body.data.account).toBe('testuser');
    });

    it('should fail with missing account', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号和密码不能为空');
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'testuser',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号和密码不能为空');
    });

    it('should fail with missing confirmPassword', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'testuser',
          password: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('确认密码不能为空');
    });

    it('should fail with password mismatch', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'testuser',
          password: '123456',
          confirmPassword: '654321'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('两次密码不一致');
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'testuser',
          password: '123',
          confirmPassword: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('密码长度至少6位');
    });

    it('should fail with invalid account format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: '@invalid@',
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号格式不正确，请使用手机号或2-20位字符的用户名');
    });

    it('should accept valid phone number', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: '13812345678',
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should fail with duplicate account', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          account: 'duplicate',
          password: '123456',
          confirmPassword: '123456'
        });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'duplicate',
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号已存在');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          account: 'logintest',
          password: '123456',
          confirmPassword: '123456'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          account: 'logintest',
          password: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('登录成功');
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.farmer.account).toBe('logintest');
    });

    it('should fail with missing account', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号和密码不能为空');
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          account: 'logintest'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号和密码不能为空');
    });

    it('should fail with non-existent account', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          account: 'nonexistent',
          password: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号或密码错误');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          account: 'logintest',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号或密码错误');
    });

    it('should fail for disabled account', async () => {
      const { pool } = await import('../config/database');
      await pool.execute(
        'UPDATE users SET status = 0 WHERE account = ?',
        ['logintest']
      );

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          account: 'logintest',
          password: '123456'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('账号已被禁用，请联系管理员');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty request body', async () => {
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(registerResponse.status).toBe(400);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(loginResponse.status).toBe(400);
    });

    it('should handle very long account name', async () => {
      const longAccount = 'a'.repeat(100);
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: longAccount,
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(400);
    });

    it('should handle Chinese characters in account', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: '中文用户名',
          password: '123456',
          confirmPassword: '123456'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should handle special characters in password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: 'specialpass',
          password: '!@#$%^&*()',
          confirmPassword: '!@#$%^&*()'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should handle null values', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: null,
          password: null,
          confirmPassword: null
        });

      expect(response.status).toBe(400);
    });

    it('should handle whitespace-only inputs', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          account: '   ',
          password: '   ',
          confirmPassword: '   '
        });

      expect(response.status).toBe(400);
    });
  });
});