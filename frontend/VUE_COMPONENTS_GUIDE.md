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

**⚠️ 注意：以下是项目中实际存在的组件列表，请务必按照实际组件接口使用：**
- BaseButton.vue
- BaseModal.vue
- BottomNav.vue
- FormInput.vue
- LoadingSpinner.vue
- TimelineItem.vue
- TopNav.vue

**❌ 不存在的组件：**
- StatusBar.vue（文档错误，实际项目中不存在此组件）

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
**⚠️ 实际组件接口（根据代码分析更新）：**

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

**实际支持的 Props（经过验证）：**
- `date` (Date | string) - 时间，必填
- `title` (string, 可选) - 标题
- `description` (string, 可选) - 描述文本
- `image` (string, 可选) - 图片URL
- `tags` (string[], 默认空数组) - 标签数组
- `metadata` (Record<string, any>, 可选) - 元数据对象
- `actions` (boolean, 默认false) - 是否显示操作区域

**事件：**
- `image-click` - 图片点击事件，参数为图片URL

**❌ 不支持的 Props（文档错误）：**
- `time` - 不存在此prop，时间通过date计算
- `date-class` - 不支持自定义日期样式类
- `title-class` - 不支持自定义标题样式类
- `tag-class` - 不支持自定义标签样式类

### 2. 页面组件架构

#### 农民端页面 (src/views/farmer/)

**FarmerLogin.vue - 农民登录页面**
- 双表单切换（登录/注册）
- 适老化设计（大字体）
- 表单验证和错误处理
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
4. **操作提示：** 关键操作提供清晰的视觉反馈
5. **简化操作：** 减少操作步骤，提供明确指引

### 实现示例

```typescript
// 操作反馈功能
const showFeedback = (text: string) => {
  // 显示操作反馈信息
  console.log(text)
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

## ⚠️ 重要更新：组件使用错误总结与最佳实践

### 常见错误分析

#### 1. iOS状态栏使用说明
**重要说明：** 项目中不使用iOS状态栏
- **原则：** 无论原型图中是否包含iOS状态栏，实际开发中都不需要实现
- **原因：** 避免与真实设备状态栏冲突，简化界面设计
- **处理方式：** 直接从顶部导航栏开始布局

```vue
<!-- ✅ 正确方式：不使用状态栏，直接从导航栏开始 -->
<template>
  <div class="page-container">
    <TopNav title="页面标题" />
    <!-- 页面内容 -->
  </div>
</template>

<!-- ❌ 错误方式：添加iOS状态栏 -->
<template>
  <div class="page-container">
    <div class="status-bar">...</div> <!-- 不要添加 -->
    <TopNav title="页面标题" />
  </div>
</template>
```

#### 2. TimelineItem 组件接口错误
**错误原因：** 文档中描述的props与实际组件不匹配
- **问题：** 使用了不存在的 `time`、`date-class` 等props
- **解决：** 严格按照实际组件接口使用

```vue
<!-- ✅ 正确方式 -->
<TimelineItem
  :date="new Date('2024-07-22')"
  title="生长记录"
  description="描述文本"
  :image="imageUrl"
  :tags="['标签1', '标签2']"
  @image-click="handleImageClick"
/>

<!-- ❌ 错误方式 -->
<TimelineItem
  :date="new Date('2024-07-22')"
  title="生长记录"
  time="今天 09:30"
  description="描述文本"
  date-class="bg-red-100 text-red-600"
  title-class="text-red-600"
  tag-class="bg-red-100 text-red-600"
/>
```

### 最佳实践

#### 1. 组件验证流程
在使用任何组件之前，请按以下步骤验证：

```bash
# 1. 检查组件是否存在
ls src/components/common/ComponentName.vue

# 2. 查看组件实际接口
cat src/components/common/ComponentName.vue
```

#### 2. AI辅助开发指导原则

**对于AI助手：**
1. **优先检查实际代码**：使用 `LS` 和 `Read` 工具验证组件存在性
2. **分析组件接口**：通过读取组件源码了解真实的props和事件
3. **避免基于文档假设**：文档可能过时，以实际代码为准
4. **原型图转换原则**：原型图是设计参考，不是组件使用指南
5. **iOS状态栏处理**：无论原型图是否包含，都不要在实际代码中实现iOS状态栏

**对于开发者：**
1. **定期更新文档**：确保文档与实际代码同步
2. **代码审查**：检查组件使用是否正确
3. **类型检查**：使用TypeScript确保组件接口正确

#### 3. 文档维护规范

- **✅ 文档应包含：** 实际存在的组件、正确的props接口、真实的使用示例
- **❌ 文档不应包含：** 不存在的组件、错误的接口定义、过时的使用方式

### 更新记录

**2024-07-23 - 重要更新**
- 明确说明项目中不使用iOS状态栏
- 更新了页面布局指导原则
- 添加了AI助手的状态栏处理规范
- 强调原型图与实际实现的差异处理

**2024-07-22 - 重要更新**
- 移除了不存在的 StatusBar 组件描述
- 更正了 TimelineItem 组件的props接口
- 添加了组件验证流程
- 增加了错误分析和最佳实践

通过这种详细的指南和错误总结，开发团队和AI助手都能更好地理解和维护这个Vue 3项目，避免类似错误，确保代码质量和项目的可持续发展。

## 📋 样式冲突防范指南

### 常见样式冲突类型

#### 1. 媒体查询覆盖问题

**问题描述：** 移动端媒体查询意外覆盖了基础样式，导致样式在特定设备上不生效。

**典型场景：**
```css
/* 基础样式 */
.message-item {
  margin: 3rem;
}

/* 移动端样式意外覆盖 */
@media (max-width: 480px) {
  .message-item {
    margin: 0 6px 10px 6px; /* 覆盖了基础的 margin: 3rem */
  }
}
```

**识别方法：**
- 样式在桌面浏览器正常，移动端模拟器不生效
- Chrome DevTools 显示样式被媒体查询规则覆盖
- iPhone/Android 等特定设备模拟器下异常

#### 2. CSS特异性(Specificity)冲突

**问题描述：** 不同选择器的优先级导致样式覆盖。

```css
/* 优先级低 */
.card { margin: 2rem; }

/* 优先级高，会覆盖上面的样式 */
.page .card { margin: 1rem; }
```

#### 3. 框架样式冲突

**问题描述：** 项目样式与 Tailwind CSS、Vue组件库等外部样式冲突。

### 样式冲突检测流程

#### 1. 多设备测试检查清单

**开发时必检项目：**
- [ ] 桌面浏览器 (Chrome, Safari, Firefox)
- [ ] 移动端模拟器 (iPhone 14 Pro Max, Samsung Galaxy S21)
- [ ] 平板模拟器 (iPad Air, iPad Pro)
- [ ] 关键断点测试 (320px, 375px, 414px, 768px, 1024px)

**检测工具使用：**
```bash
# Chrome DevTools 断点检测
1. F12 → Toggle Device Toolbar
2. 选择不同设备型号
3. 检查 Elements → Computed 面板
4. 查看 Sources → 样式来源
```

#### 2. 样式覆盖诊断方法

**使用浏览器开发者工具：**
1. **Elements面板**：选中元素，查看右侧Styles面板
2. **Computed面板**：查看最终计算的样式值
3. **查找覆盖规则**：被删除线划掉的样式表示被覆盖
4. **检查媒体查询**：展开@media规则查看条件

**代码检查方法：**
```bash
# 搜索重复的class定义
grep -r "\.message-item" src/
# 查找相关的媒体查询
grep -r "@media.*480px" src/
```

### 样式冲突预防策略

#### 1. 命名规范和组织结构

**推荐的CSS组织结构：**
```css
/* === 基础样式 === */
.component-name {
  /* 核心样式，不轻易修改 */
}

/* === 状态变体样式 === */
.component-name--active { /* BEM命名法 */ }
.component-name.active { /* 状态类 */ }

/* === 响应式样式 === */
@media (max-width: 768px) {
  .component-name {
    /* 明确注释：这里会覆盖基础样式的哪些属性 */
  }
}

/* === 主题样式 === */
.theme-dark .component-name { /* 主题变体 */ }
```

#### 2. CSS变量统一管理

**避免硬编码，使用CSS变量：**
```css
:root {
  --message-margin-desktop: 3rem;
  --message-margin-mobile: 1.5rem;
  --message-margin-tablet: 2rem;
}

.message-item {
  margin: var(--message-margin-desktop);
}

@media (max-width: 768px) {
  :root {
    --message-margin-desktop: var(--message-margin-tablet);
  }
}

@media (max-width: 480px) {
  :root {
    --message-margin-desktop: var(--message-margin-mobile);
  }
}
```

#### 3. 媒体查询最佳实践

**移动优先策略：**
```css
/* ✅ 推荐：移动优先 */
.component {
  /* 移动端样式 */
  margin: 1rem;
}

@media (min-width: 768px) {
  .component {
    /* 平板样式 */
    margin: 2rem;
  }
}

@media (min-width: 1024px) {
  .component {
    /* 桌面样式 */
    margin: 3rem;
  }
}
```

**避免范围重叠：**
```css
/* ❌ 避免：范围重叠可能导致冲突 */
@media (max-width: 768px) { /* ... */ }
@media (max-width: 480px) { /* 会覆盖上面的规则 */ }

/* ✅ 推荐：明确范围 */
@media (max-width: 480px) { /* 手机 */ }
@media (min-width: 481px) and (max-width: 768px) { /* 平板 */ }
@media (min-width: 769px) { /* 桌面 */ }
```

#### 4. 组件样式隔离

**Vue Scoped Styles：**
```vue
<style scoped>
/* 自动添加data-v-xxx属性，避免全局冲突 */
.message-item {
  margin: 3rem;
}
</style>
```

**CSS Modules：**
```vue
<style module>
.messageItem {
  margin: 3rem;
}
</style>

<template>
  <div :class="$style.messageItem">
    <!-- 内容 -->
  </div>
</template>
```

### 冲突解决方案

#### 1. 优先级调整

**使用CSS特异性：**
```css
/* 提高特异性而不使用!important */
.page-container .message-item {
  margin: 3rem;
}
```

**谨慎使用!important：**
```css
/* 只在必要时使用，并添加注释说明原因 */
.message-item {
  margin: 3rem !important; /* 修复移动端媒体查询覆盖问题 */
}
```

#### 2. 条件样式应用

**通过Vue条件应用样式：**
```vue
<template>
  <div 
    :class="{
      'message-item': true,
      'message-item--mobile': isMobile,
      'message-item--desktop': !isMobile
    }"
  >
    <!-- 内容 -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isMobile = ref(false)

onMounted(() => {
  isMobile.value = window.innerWidth <= 768
})
</script>
```

#### 3. 样式重构策略

**拆分样式职责：**
```css
/* 基础布局 */
.message-layout {
  display: block;
  border-radius: 12px;
}

/* 间距控制 */
.message-spacing {
  margin: var(--message-margin);
}

/* 视觉样式 */
.message-visual {
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 调试工具和技巧

#### 1. 浏览器调试技巧

**Chrome DevTools高级功能：**
```javascript
// 控制台快速检查元素样式
$0.style.margin = '5rem'; // $0是当前选中的元素
getComputedStyle($0).margin; // 查看计算后的样式
```

**样式来源追踪：**
- 右键元素 → 检查
- Styles面板中点击样式规则旁边的链接
- 跳转到源文件的具体位置

#### 2. 开发工具集成

**VSCode插件推荐：**
- CSS Peek：快速查看CSS定义
- CSS Navigation：在CSS和HTML间导航
- IntelliSense for CSS：CSS自动补全

**Lint规则配置：**
```json
// .stylelintrc.json
{
  "rules": {
    "no-duplicate-selectors": true,
    "media-query-no-invalid": true,
    "declaration-no-important": "warning"
  }
}
```

### 团队协作规范

#### 1. 代码审查检查点

**CSS相关检查清单：**
- [ ] 新增样式是否与现有样式冲突
- [ ] 媒体查询范围是否合理
- [ ] 是否使用了项目统一的CSS变量
- [ ] 响应式设计是否在所有断点测试
- [ ] 是否遵循项目的命名规范

#### 2. 文档化要求

**样式修改记录：**
```markdown
## 样式修改记录

### 2025-07-24 - 消息卡片间距调整
- **文件：** `src/views/farmer/FarmerMessages.vue`
- **修改：** 调整 `.message-item` 的 `margin` 从 `2rem` 到 `3rem`
- **影响：** 移动端和桌面端的消息卡片间距
- **测试：** ✅ iPhone 14 Pro Max, ✅ iPad Air, ✅ Desktop Chrome
- **冲突解决：** 在移动端媒体查询中使用 `!important` 覆盖默认样式
```

### 自动化检测方案

#### 1. 样式回归测试

**使用视觉回归测试：**
```javascript
// 使用Percy或Chromatic进行视觉测试
describe('视觉回归测试', () => {
  it('消息页面在不同设备下样式一致', () => {
    cy.visit('/farmer/messages')
    cy.viewport(375, 667) // iPhone
    cy.percySnapshot('messages-mobile')
    
    cy.viewport(1024, 768) // Desktop
    cy.percySnapshot('messages-desktop')
  })
})
```

#### 2. CSS冲突检测

**自定义工具检测重复样式：**
```javascript
// scripts/detect-css-conflicts.js
const fs = require('fs')
const path = require('path')

function findDuplicateSelectors(cssContent) {
  const selectors = cssContent.match(/\.[a-zA-Z-_]+\s*{/g)
  const counts = {}
  
  selectors?.forEach(selector => {
    const clean = selector.replace(/\s*{/, '')
    counts[clean] = (counts[clean] || 0) + 1
  })
  
  return Object.entries(counts).filter(([_, count]) => count > 1)
}
```

### 相关文档

- [CSS特异性计算器](https://specificity.keegan.st/)
- [媒体查询规范](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries)
- [Vue样式指南](https://vuejs.org/style-guide/)
- [移动端CSS冲突修复案例](/docs/fix_bug/移动端样式被媒体查询覆盖问题修复.md)

---

