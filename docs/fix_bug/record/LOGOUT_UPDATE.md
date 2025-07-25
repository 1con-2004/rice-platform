# 退出登录功能更新

## 修改内容

### 更新前：
- 用户点击退出登录后跳转到登录页面 (`/farmer/login`)
- 需要手动刷新或导航才能回到首页

### 更新后：
- 用户点击退出登录后直接跳转到首页 (`/`)
- 无需手动操作，自动回到HomePage.vue页面

## 具体修改

在 `frontend/src/views/farmer/FarmerSettings.vue` 文件中：

```javascript
// 修改前
router.push({ name: 'Login' })

// 修改后  
router.push({ name: 'HomePage' })
```

## 退出登录流程

1. 用户在农户设置页面点击"退出登录"按钮
2. 弹出确认对话框："确定要退出登录吗？"
3. 用户点击"确定"
4. 系统执行以下操作：
   - 调用后端退出登录API
   - 清除本地存储的token和用户信息
   - 显示"已退出登录"成功提示
   - **自动跳转到首页** (HomePage.vue)

## 测试步骤

1. 启动前后端服务
2. 使用测试账户登录（如：newuser / 123456）
3. 进入农户设置页面
4. 点击"退出登录"按钮
5. 确认退出
6. 验证是否自动跳转到首页，而不是登录页

## 相关文件
- `frontend/src/views/farmer/FarmerSettings.vue` - 主要修改文件
- `frontend/src/views/HomePage.vue` - 跳转目标页面
- `frontend/src/router/index.ts` - 路由配置

## 用户体验改进
- ✅ 退出后直接返回首页，用户体验更加流畅
- ✅ 无需额外的手动导航操作
- ✅ 符合用户期望的退出行为