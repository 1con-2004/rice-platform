# FarmerSettings 相关 API 文档

## 基础信息
- **Base URL**: `http://localhost:3001/api`
- **认证方式**: JWT Token (在请求头中包含 `Authorization: Bearer <token>`)

## API 端点

### 1. 获取用户信息和农户档案
```
GET /api/user/profile
```

**功能**: 获取当前用户的基本信息和农户档案信息  
**需要认证**: 是  

**响应示例**:
```json
{
  "success": true,
  "data": {
    "userInfo": {
      "id": 1,
      "account": "farmer001",
      "created_at": "2024-01-15T00:00:00.000Z",
      "updated_at": "2024-07-20T00:00:00.000Z",
      "status": 1,
      "roles": "farmer"
    },
    "farmerProfile": {
      "id": 1,
      "user_id": 1,
      "name": "张大力",
      "phone": "13812345678",
      "location": "江苏省苏州市吴中区东山镇农业园区",
      "farm_info": "占地15亩的现代化农场，主要种植优质水稻和小麦...",
      "avatar_url": "/uploads/avatars/avatar_1234567890_123456789.jpg",
      "created_at": "2024-01-15T00:00:00.000Z",
      "updated_at": "2024-07-20T00:00:00.000Z"
    }
  }
}
```

### 2. 更新农户档案信息
```
PUT /api/farmer/profile
```

**功能**: 更新农户档案的基本信息  
**需要认证**: 是  

**请求参数**:
```json
{
  "name": "张大力",
  "phone": "13812345678", 
  "location": "江苏省苏州市吴中区东山镇农业园区",
  "farm_info": "农场详细信息描述"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "档案更新成功"
}
```

**字段验证**:
- `phone`: 必须是11位手机号格式 (1[3-9]xxxxxxxxx)
- 至少提供一个要更新的字段

### 3. 上传头像
```
POST /api/farmer/avatar
```

**功能**: 上传农户头像图片  
**需要认证**: 是  
**Content-Type**: `multipart/form-data`

**请求参数**:
- `avatar`: 图片文件 (form-data)

**文件限制**:
- 支持格式: JPG, PNG
- 文件大小: 最大 2MB

**响应示例**:
```json
{
  "success": true,
  "message": "头像上传成功",
  "data": {
    "avatar_url": "/uploads/avatars/avatar_1234567890_123456789.jpg"
  }
}
```

### 4. 修改密码
```
PUT /api/user/password
```

**功能**: 修改用户登录密码  
**需要认证**: 是  

**请求参数**:
```json
{
  "oldPassword": "当前密码",
  "newPassword": "新密码"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

**字段验证**:
- `newPassword`: 至少6位字符
- `oldPassword`: 必须与当前密码匹配

### 5. 退出登录
```
POST /api/auth/logout
```

**功能**: 退出用户登录  
**需要认证**: 否  

**响应示例**:
```json
{
  "success": true,
  "message": "退出登录成功"
}
```

## 错误响应格式

所有API在出错时都会返回统一格式的错误响应:

```json
{
  "success": false,
  "message": "错误描述信息"
}
```

常见HTTP状态码:
- `400`: 请求参数错误
- `401`: 未认证或认证失败
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

## 静态文件访问

上传的头像图片可以通过以下URL访问:
```
http://localhost:3001/uploads/avatars/文件名
```

## 数据库表对应关系

### users 表字段:
- `id`, `account`, `password`, `created_at`, `updated_at`, `status`, `roles`

### farmer_profiles 表字段:
- `id`, `user_id`, `name`, `phone`, `location`, `farm_info`, `avatar_url`, `created_at`, `updated_at`

## 前端字段映射

前端 FarmerSettings.vue 中的字段与数据库字段对应关系:
- `real_name` → `name`
- `contact_phone` → `phone` 
- `farm_location` → `location`
- `farm_description` → `farm_info`
- `avatar_url` → `avatar_url`