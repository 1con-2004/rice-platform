# Rice Platform Backend API

## 项目简介
智慧农业溯源平台的后端API服务，提供农户用户的注册和登录功能。

## 技术栈
- Node.js + TypeScript
- Express.js 4.x
- MySQL 2
- JWT认证
- 明文密码存储
- Jest测试框架

## 项目结构
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # 数据库配置
│   ├── controllers/
│   │   └── authController.ts    # 认证控制器
│   ├── middleware/
│   │   └── auth.ts              # JWT认证中间件
│   ├── models/
│   │   └── Farmer.ts            # 农户用户模型
│   ├── routes/
│   │   └── authRoutes.ts        # 认证路由
│   ├── tests/
│   │   ├── auth.test.ts         # 认证测试用例
│   │   └── setup.ts             # 测试环境配置
│   └── index.ts                 # 应用入口
├── .env                         # 环境变量
├── package.json
├── tsconfig.json
└── jest.config.js
```

## 环境配置

### 1. 数据库设置
确保MySQL服务运行在端口3306，用户名和密码都是root：
```sql
-- 数据库已自动创建：rice_platform
-- 用户表已自动创建：farmers
```

### 2. 环境变量
`.env`文件已配置：
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=rice_platform
JWT_SECRET=rice_platform_secret_key_2024
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
```

## API接口

### 基础URL
```
http://localhost:3001/api
```

### 健康检查
```
GET /api/health
```

### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "account": "testuser",           // 用户名或手机号
  "password": "123456",            // 密码(至少6位)
  "confirmPassword": "123456"      // 确认密码
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": 1,
    "account": "testuser"
  }
}
```

### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "account": "testuser",    // 用户名或手机号
  "password": "123456"      // 密码
}
```

**成功响应：**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "farmer": {
      "id": 1,
      "account": "testuser"
    }
  }
}
```

## 账号格式规则
- **用户名**：2-20位中文、英文字母、数字、下划线
- **手机号**：11位数字，以1开头，第二位为3-9
- **密码**：至少6位字符

## 错误响应格式
```json
{
  "success": false,
  "message": "错误描述"
}
```

## 常见错误码
- `400` - 请求参数错误
- `401` - 认证失败（账号或密码错误）
- `403` - 账号被禁用
- `409` - 账号已存在
- `500` - 服务器内部错误

## 开发命令

### 启动开发服务器
```bash
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 运行测试
```bash
pnpm test
```

### 启动生产服务器
```bash
pnpm start
```

## 测试用例
项目包含完整的测试用例，覆盖：
- ✅ 正常注册和登录流程
- ✅ 参数验证（缺失、格式错误）
- ✅ 边界条件测试
- ✅ 重复注册检测
- ✅ 密码验证
- ✅ 账号状态检查
- ✅ 特殊字符处理

## 前端集成
前端可通过以下方式调用接口：

```javascript
// 注册
const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    account: 'testuser',
    password: '123456',
    confirmPassword: '123456'
  })
});

// 登录
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    account: 'testuser',
    password: '123456'
  })
});
```

## 安全特性
- ✅ 明文密码存储（开发阶段）
- ✅ JWT token认证
- ✅ CORS跨域保护
- ✅ 输入参数验证
- ✅ SQL注入防护
- ✅ 错误信息脱敏