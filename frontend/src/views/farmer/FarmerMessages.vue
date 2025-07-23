<template>
  <div class="farmer-messages">
    <!-- 顶部导航栏 -->
    <TopNav 
      title="消息中心"
      :show-back="false"
    >
      <template #actions>
        <button @click="markAllRead" class="text-white text-sm">
          全部已读
        </button>
      </template>
    </TopNav>

    <!-- 消息列表 -->
    <div class="messages-container">
      <!-- 消息项目 -->
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message-item"
        :class="{ 'unread': !message.read }"
        @click="openMessage(message)"
      >
        <div class="message-avatar">
          <i :class="message.icon" class="text-2xl"></i>
        </div>
        <div class="message-content">
          <div class="message-header">
            <h3 class="message-title">{{ message.title }}</h3>
            <span class="message-time">{{ formatTime(message.time) }}</span>
          </div>
          <p class="message-preview">{{ message.preview }}</p>
          <div class="message-tags" v-if="message.tags">
            <span 
              v-for="tag in message.tags" 
              :key="tag"
              class="message-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="message-status" v-if="!message.read">
          <span class="unread-dot"></span>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <BottomNav :items="navItems" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TopNav from '@/components/common/TopNav.vue'
import BottomNav from '@/components/common/BottomNav.vue'

const router = useRouter()

// 响应式数据
const messages = ref([
  {
    id: 1,
    title: '系统通知',
    preview: '您的水稻生长记录已更新，请及时查看最新状态。',
    time: new Date('2024-07-22 09:30'),
    read: false,
    icon: 'fas fa-bell text-blue-500',
    tags: ['系统通知']
  },
  {
    id: 2,
    title: '专家建议',
    preview: '根据您的作物生长情况，建议在未来一周内适量施肥。',
    time: new Date('2024-07-21 14:20'),
    read: false,
    icon: 'fas fa-user-tie text-green-500',
    tags: ['专家建议', '施肥']
  },
  {
    id: 3,
    title: '天气提醒',
    preview: '明天有中雨，建议做好田间排水准备。',
    time: new Date('2024-07-21 08:15'),
    read: true,
    icon: 'fas fa-cloud-rain text-blue-400',
    tags: ['天气', '提醒']
  },
  {
    id: 4,
    title: '买家询盘',
    preview: '有买家对您的水稻感兴趣，点击查看详情。',
    time: new Date('2024-07-20 16:45'),
    read: true,
    icon: 'fas fa-shopping-cart text-orange-500',
    tags: ['买家', '询盘']
  },
  {
    id: 5,
    title: '质量检测',
    preview: '您提交的作物样本检测报告已出具，请查收。',
    time: new Date('2024-07-19 11:30'),
    read: true,
    icon: 'fas fa-clipboard-check text-purple-500',
    tags: ['检测报告']
  }
])

// 底部导航配置 - FarmerMessages页面应该高亮"消息"
const navItems = [
  { 
    name: 'FarmerMyCrops', 
    label: '我的作物', 
    icon: 'fas fa-leaf', 
    route: 'FarmerMyCrops'
  },
  { 
    name: 'FarmerPublish', 
    label: '发布', 
    icon: 'fas fa-plus', 
    route: 'FarmerPublish' 
  },
  { 
    name: 'FarmerMessages', 
    label: '消息', 
    icon: 'fas fa-comments', 
    route: 'FarmerMessages',
    active: true  // FarmerMessages页面高亮"消息"
  }
]

// 格式化时间
const formatTime = (time: Date) => {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return time.toLocaleDateString('zh-CN')
  }
}

// 打开消息
const openMessage = (message: any) => {
  message.read = true
  // 这里可以跳转到消息详情页面或显示消息内容
  console.log('打开消息:', message)
}

// 标记全部已读
const markAllRead = () => {
  messages.value.forEach(message => {
    message.read = true
  })
}

// 页面初始化
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.farmer-messages {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
  padding-bottom: 5rem;
}

.messages-container {
  padding: 1rem 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.message-item:hover {
  background: #f9fafb;
}

.message-item.unread {
  background: #f0f9ff;
  border-left: 4px solid #3b82f6;
}

.message-avatar {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.message-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.message-time {
  font-size: 0.875rem;
  color: #6b7280;
  flex-shrink: 0;
  margin-left: 1rem;
}

.message-preview {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.message-tag {
  background: #e0f2fe;
  color: #0891b2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.message-status {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: 1rem;
}

.unread-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #ef4444;
  border-radius: 50%;
}

/* 顶部导航栏样式 */
:deep(.top-nav) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 底部导航栏样式 */
:deep(.bottom-nav) {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 0;
  z-index: 40;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.bottom-nav .nav-item) {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s ease;
  text-decoration: none;
  min-width: 60px;
}

:deep(.bottom-nav .nav-item.active) {
  color: #16a34a;
}

:deep(.bottom-nav .nav-item:hover) {
  color: #16a34a;
}

:deep(.bottom-nav .nav-icon) {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

:deep(.bottom-nav .nav-item span) {
  font-size: 0.75rem;
  font-weight: 500;
}

/* 适老化设计 - 大字体，高对比度 */
@media (max-width: 768px) {
  .message-title {
    font-size: 1rem;
  }
  
  .message-preview {
    font-size: 0.875rem;
  }
  
  .message-time {
    font-size: 0.75rem;
  }
}
</style>