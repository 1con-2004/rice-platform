# 智慧农业溯源系统 - Vue 3 组件使用指南

## 项目概述

本项目将原型HTML文件转换为可维护和可扩展的Vue 3组件，采用TypeScript、组合式API和现代前端开发最佳实践。

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 现代状态管理库
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **FontAwesome** - 图标库

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── common/         # 通用组件
│   ├── homepage/       # 首页专用组件
│   └── prototype/      # 原型展示组件
├── views/              # 页面组件
│   ├── farmer/         # 农民端页面
│   ├── buyer/          # 买家端页面
│   └── admin/          # 管理端页面
├── styles/             # 样式文件
│   ├── variables.css   # CSS变量定义
│   ├── base.css        # 基础样式
│   ├── layout.css      # 布局样式
│   └── components.css  # 组件样式
├── router/             # 路由配置
├── stores/             # 状态管理
└── utils/              # 工具函数
```

## 核心组件详解

### 1. 通用组件 (src/components/common/)

#### StatusBar.vue - iOS状态栏组件
```vue
<template>
  <StatusBar />
</template>
```

**功能特性：**
- 自动更新时间显示
- 模拟iOS状态栏外观
- 电池电量指示器

**使用场景：** 所有移动端页面的顶部

#### TopNav.vue - 顶部导航栏
```vue
<template>
  <TopNav 
    title="页面标题" 
    :show-back="true"
  >
    <template #actions>
      <button>操作按钮</button>
    </template>
  </TopNav>
</template>
```

**Props：**
- `title` (string) - 导航标题
- `showBack` (boolean) - 是否显示返回按钮

**插槽：**
- `actions` - 右侧操作按钮区域

#### BottomNav.vue - 底部导航栏
```vue
<template>
  <BottomNav :items="navItems" />
</template>

<script setup>
const navItems = [
  { name: 'FarmerMyCrops', label: '我的作物', icon: 'fas fa-seedling', route: 'FarmerMyCrops' },
  { name: 'FarmerPublish', label: '发布', icon: 'fas fa-plus', route: 'FarmerPublish' },
  { name: 'FarmerMessages', label: '消息', icon: 'fas fa-envelope', route: 'FarmerMessages' },
  { name: 'FarmerSettings', label: '设置', icon: 'fas fa-cog', route: 'FarmerSettings' }
]
</script>
```

**Props：**
- `items` - 导航项目数组，包含 name, label, icon, route 字段

#### FormInput.vue - 表单输入组件
```vue
<template>
  <FormInput
    v-model="inputValue"
    label="输入标签"
    placeholder="请输入内容"
    icon="fas fa-user"
    :required="true"
    :error-message="errorMsg"
  >
    <template #suffix>
      <button>后缀按钮</button>
    </template>
  </FormInput>
</template>
```

**Props：**
- `modelValue` (string) - 输入值
- `label` (string) - 标签文本
- `placeholder` (string) - 占位符
- `type` (string) - 输入类型，默认 'text'
- `required` (boolean) - 是否必填
- `disabled` (boolean) - 是否禁用
- `icon` (string) - 图标类名
- `iconColor` (string) - 图标颜色类
- `errorMessage` (string) - 错误信息

**事件：**
- `update:modelValue` - 值更新事件
- `focus` - 聚焦事件
- `blur` - 失焦事件

#### BaseButton.vue - 按钮组件
```vue
<template>
  <BaseButton
    label="按钮文本"
    variant="primary"
    size="large"
    icon="fas fa-check"
    :loading="isLoading"
    @click="handleClick"
  />
</template>
```

**Props：**
- `label` (string) - 按钮文本
- `type` ('button' | 'submit' | 'reset') - 按钮类型
- `variant` ('primary' | 'secondary' | 'warning' | 'admin') - 样式变体
- `size` ('normal' | 'large' | 'xl') - 尺寸
- `disabled` (boolean) - 是否禁用
- `loading` (boolean) - 是否显示加载状态
- `icon` (string) - 图标类名

#### BaseModal.vue - 模态框组件
```vue
<template>
  <BaseModal
    v-model:visible="showModal"
    title="模态框标题"
    size="medium"
    :show-footer="true"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <p>模态框内容</p>
    
    <template #footer>
      <BaseButton label="自定义按钮" />
    </template>
  </BaseModal>
</template>
```

**Props：**
- `visible` (boolean) - 是否可见
- `title` (string) - 标题
- `size` ('small' | 'medium' | 'large' | 'full') - 尺寸
- `closable` (boolean) - 是否显示关闭按钮
- `showHeader` (boolean) - 是否显示头部
- `showFooter` (boolean) - 是否显示底部
- `showCancel` (boolean) - 是否显示取消按钮
- `showConfirm` (boolean) - 是否显示确认按钮
- `confirmText` (string) - 确认按钮文本
- `loading` (boolean) - 确认按钮加载状态
- `closeOnOverlay` (boolean) - 点击遮罩是否关闭

#### TimelineItem.vue - 时间线项目
```vue
<template>
  <TimelineItem
    :date="new Date()"
    title="事件标题"
    description="事件描述"
    :image="imageUrl"
    :tags="['标签1', '标签2']"
    :metadata="{ weather: '晴天', temperature: '25°C' }"
    :actions="true"
    @image-click="handleImageClick"
  >
    <template #metadata="{ metadata }">
      <div>天气：{{ metadata.weather }}</div>
      <div>温度：{{ metadata.temperature }}</div>
    </template>
    
    <template #actions>
      <BaseButton label="编辑" size="normal" />
      <BaseButton label="删除" variant="warning" size="normal" />
    </template>
  </TimelineItem>
</template>
```

### 2. 页面组件架构

#### 农民端页面 (src/views/farmer/)

**FarmerLogin.vue - 农民登录页面**
- 双表单切换（登录/注册）
- 适老化设计（大字体、语音提示）
- 表单验证和错误处理
- 语音播报功能
- 帮助和客服集成

**FarmerMyCrops.vue - 我的作物管理**
- 作物概览卡片
- 时间线展示
- 排序和筛选功能
- 图片预览
- 操作按钮

**FarmerPublish.vue - 发布动态**
- 多媒体上传
- 标签选择
- 进度指示
- 表单验证

**FarmerMessages.vue - 消息中心**
- 消息列表
- 状态标识
- 聊天界面
- 快速回复

**FarmerSettings.vue - 个人设置**
- 用户信息管理
- 系统设置
- 隐私设置
- 帮助支持

#### 买家端页面 (src/views/buyer/)

**BuyerHome.vue - 买家首页**
- 作物浏览
- 轮播图展示
- 分类筛选
- 搜索功能

**BuyerCropDetail.vue - 作物详情**
- 时间线展示
- 日历视图
- 评论系统
- 农民信息

**BuyerSearch.vue - 搜索页面**
- 高级筛选
- 搜索建议
- 结果展示
- 历史记录

#### 管理端页面 (src/views/admin/)

**AdminLogin.vue - 管理员登录**
- 安全登录表单
- 权限验证
- 安全提醒
- 技术支持

**AdminUserManagement.vue - 用户管理**
- 用户列表
- 状态管理
- 批量操作
- 详情查看

**AdminContentReview.vue - 内容审核**
- 内容列表
- 审核操作
- 举报处理
- 农民沟通

**AdminAnalytics.vue - 数据统计**
- 数据图表
- 报表导出
- 趋势分析
- 实时监控

## 样式系统

### CSS变量 (src/styles/variables.css)

```css
:root {
  /* 主题色彩 */
  --primary-green: #16a34a;
  --secondary-green: #059669;
  --light-green: #dcfce7;
  
  /* 适老化设计尺寸 */
  --text-base: 16px;
  --text-large: 18px;
  --text-title: 24px;
  --button-min-size: 60px;
  --border-radius: 12px;
  
  /* 管理端主题色 */
  --admin-primary: #7c3aed;
  --admin-secondary: #a855f7;
}
```

### 响应式设计

项目采用移动优先的响应式设计：

```css
/* 手机端 */
@media (max-width: 480px) {
  .phone-container {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
}

/* 平板端 */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

## 状态管理

使用 Pinia 进行状态管理：

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    role: 'farmer' // 'farmer' | 'buyer' | 'admin'
  }),
  
  actions: {
    async login(credentials) {
      // 登录逻辑
    },
    
    logout() {
      // 登出逻辑
    }
  }
})
```

## 路由守卫

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 检查认证状态
  if (to.meta.requiresAuth) {
    const userStore = useUserStore()
    if (!userStore.isAuthenticated) {
      next('/farmer/login')
      return
    }
  }
  
  next()
})
```

## 开发指南


### 组件开发规范

1. **组件命名：** 使用 PascalCase
2. **文件命名：** 与组件名保持一致
3. **Props定义：** 使用 TypeScript 接口
4. **事件命名：** 使用 kebab-case
5. **样式作用域：** 使用 scoped 样式

### 示例组件模板

```vue
<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  optional?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  optional: false
})

const emit = defineEmits<{
  'custom-event': [value: string]
}>()

// 组件逻辑
</script>

<style scoped>
.my-component {
  /* 组件样式 */
}
</style>
```

## 无障碍性 (Accessibility)

### 适老化设计特性

1. **大字体：** 最小字体16px，重要内容18px+
2. **高对比度：** 确保文字和背景对比度符合WCAG标准
3. **大按钮：** 最小触控区域60px×60px
4. **语音提示：** 关键操作提供语音反馈
5. **简化操作：** 减少操作步骤，提供明确指引

### 实现示例

```typescript
// 语音播报功能
const announceVoice = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }
}
```

## 性能优化

### 1. 懒加载
```typescript
// 路由懒加载
const FarmerLogin = () => import('@/views/farmer/FarmerLogin.vue')
```

### 2. 图片优化
```vue
<template>
  <img
    :src="imageSrc"
    :alt="imageAlt"
    loading="lazy"
    @error="handleImageError"
  />
</template>
```

### 3. 组件缓存
```vue
<template>
  <KeepAlive>
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

## 测试策略

### 单元测试
```typescript
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/common/BaseButton.vue'

describe('BaseButton', () => {
  it('renders properly', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Test Button' }
    })
    expect(wrapper.text()).toContain('Test Button')
  })
})
```

## 部署指南

### 构建配置
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

### 环境变量
```env
# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=智慧农业溯源系统
```

## 扩展指南

### 添加新页面

1. 在对应模块目录创建Vue文件
2. 在路由配置中添加路由
3. 更新导航组件
4. 添加相应的状态管理

### 添加新功能

1. 分析功能需求
2. 设计组件结构
3. 实现核心逻辑
4. 添加样式和交互
5. 编写测试用例
6. 更新文档

## AI使用建议

在与AI协作时，请提供以下信息以获得最佳帮助：

1. **具体需求：** 明确要实现的功能
2. **上下文：** 说明在哪个模块和组件中
3. **约束条件：** 性能、兼容性等要求
4. **现有代码：** 相关的现有实现
5. **预期结果：** 期望的最终效果

### 示例问询格式

```
我需要在农民端添加一个作物健康监测功能：

1. 功能需求：
   - 显示作物健康状态
   - 提供病虫害识别
   - 给出护理建议

2. 技术要求：
   - 使用现有的TimelineItem组件
   - 集成图片上传功能
   - 适配适老化设计

3. 相关文件：
   - src/views/farmer/FarmerMyCrops.vue
   - src/components/common/TimelineItem.vue

请帮我设计组件结构和实现方案。
```

通过这种详细的指南，开发团队和AI助手都能更好地理解和维护这个Vue 3项目，确保代码质量和项目的可持续发展。